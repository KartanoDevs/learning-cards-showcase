import { Request, Response, NextFunction } from 'express';
import { Types } from 'mongoose';
import { Card } from '../models/Card';
import { asyncHandler } from '../utils/asyncHandler';
import { isValidObjectId } from '../utils/validateObjectId';

// Util: aplica reverse a un array de cards (intercambia english/spanish solo en la respuesta)
function applyReverse<T extends { english: string; spanish: string }>(items: T[], reverse?: boolean) {
  if (!reverse) return items;
  return items.map((it) => ({ ...it, english: it.spanish, spanish: it.english }));
}

/** Implementación pura del listado (con soporte de reverse y shuffle paginado) */
async function listCardsImpl(req: Request, res: Response, _next: NextFunction) {
  const { groupId, enabled, page = '1', limit = '20', q, reverse, shuffle } = req.query as {
    groupId?: string;
    enabled?: string;
    page?: string;
    limit?: string;
    q?: string;
    reverse?: string;
    shuffle?: string;
  };

  const filter: any = {};
  if (groupId && isValidObjectId(groupId)) filter.groupId = new Types.ObjectId(groupId);
  if (enabled !== undefined) filter.enabled = enabled === 'true';
  if (q && q.trim().length > 0) filter.$text = { $search: q };

  const pageNum = Math.max(parseInt(page ?? '1', 10) || 1, 1);

  const DEFAULT_LIMIT = 20;
  const MAX_LIMIT = 9999;
  const requestedLimit = parseInt( limit ?? String( DEFAULT_LIMIT ), 10 ) || DEFAULT_LIMIT;
  const lim = Math.min( Math.max( requestedLimit, 1 ), MAX_LIMIT );
  const wantShuffle = shuffle === 'true';

  if (wantShuffle) {
    // Orden aleatorio paginado con $rand (mantiene total para meta)
    const pipeline: any[] = [
      { $match: filter },
      { $addFields: { __rand: { $rand: {} } } },
      { $sort: { __rand: 1 } },
      { $skip: (pageNum - 1) * lim },
      { $limit: lim },
    ];
    const [items, total] = await Promise.all([Card.aggregate(pipeline), Card.countDocuments(filter)]);
    const data = applyReverse(items as any[], reverse === 'true');
    return res.json({
      ok: true,
      data,
      meta: { page: pageNum, limit: lim, total, pages: Math.ceil(total / lim), shuffled: true },
    });
  }

  // Orden lógico por defecto modificado: 1..N primero, luego 0s (y vacíos), desempatando por español
  // Usamos aggregation para crear un campo calculado 'effectiveOrder'
  const pipeline: any[] = [
    { $match: filter },
    {
      $addFields: {
        effectiveOrder: {
          $cond: {
            if: { $gt: [ '$order', 0 ] },
            then: '$order',
            else: 999999999 // Valor alto para enviarlos al final
          }
        }
      }
    },
    { $sort: { effectiveOrder: 1, spanish: 1 } }, // Orden principal y desempate
    {
      $facet: {
        metadata: [ { $count: 'total' } ],
        data: [ { $skip: ( pageNum - 1 ) * lim }, { $limit: lim } ]
      }
    }
  ];

  const [ result ] = await Card.aggregate( pipeline );

  const total = result.metadata[ 0 ]?.total ?? 0;
  const items = result.data ?? [];

  const data = applyReverse(items as any[], reverse === 'true');

  return res.json({
    ok: true,
    data,
    meta: { page: pageNum, limit: lim, total, pages: Math.ceil(total / lim), shuffled: false },
  });
}

// GET /api/cards?groupId=...&enabled=true&page=1&limit=20&q=texto&reverse=true&shuffle=true
export const listCards = asyncHandler(listCardsImpl);

// GET /api/groups/:groupId/cards?enabled=true&page=1&limit=20&reverse=true&shuffle=true
export const listCardsByGroup = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { groupId } = req.params;
  if (!groupId || !isValidObjectId(groupId)) {
    return res.status(400).json({ ok: false, message: 'groupId inválido' });
  }
  // Reutiliza el impl de listado pasando groupId en query
  (req.query as any).groupId = groupId;
  return listCardsImpl(req, res, next);
});

// GET /api/cards/random?groupId=...&enabled=true&count=20&reverse=true
// Muestra aleatoria no paginada con $sample
export const listCardsRandom = asyncHandler(async (req: Request, res: Response) => {
  const { groupId, enabled, count = '20', reverse } = req.query as {
    groupId?: string;
    enabled?: string;
    count?: string;
    reverse?: string;
  };

  const lim = Math.min(Math.max(parseInt(count ?? '20', 10) || 20, 1), 200);

  const match: any = {};
  if (groupId && isValidObjectId(groupId)) match.groupId = new Types.ObjectId(groupId);
  if (enabled !== undefined) match.enabled = enabled === 'true';

  const items = await Card.aggregate([{ $match: match }, { $sample: { size: lim } }]);
  const data = applyReverse(items as any[], reverse === 'true');

  res.json({ ok: true, data, meta: { count: data.length, sampled: true } });
});

// POST /api/cards  (crear)
export const createCard = asyncHandler(async (req: Request, res: Response) => {
  const { english, spanish, imageUrl, groupId, order, enabled, tags } = req.body as {
    english?: string;
    spanish?: string;
    imageUrl?: string | null;
    groupId?: string;
    order?: number;
    enabled?: boolean;
    tags?: unknown;
  };

  if (!english || !spanish || !groupId) {
    return res.status(400).json({ ok: false, message: 'english, spanish y groupId son obligatorios' });
  }
  if (!isValidObjectId(groupId)) {
    return res.status(400).json({ ok: false, message: 'groupId inválido' });
  }

  const card = await Card.create({
    english: String(english).trim(),
    spanish: String(spanish).trim(),
    imageUrl: imageUrl ?? null,
    groupId,
    order: typeof order === 'number' ? order : 0,
    enabled: enabled ?? true,
    tags: Array.isArray(tags) ? (tags as unknown[]).map(String) : [],
  });

  res.status(201).json({ ok: true, data: card });
});

// PATCH /api/cards/:id  (editar)
export const updateCard = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id || !isValidObjectId(id)) {
    return res.status(400).json({ ok: false, message: 'ID inválida' });
  }

  const updatable: any = {};
  const allowed = ['english', 'spanish', 'imageUrl', 'groupId', 'order', 'enabled', 'tags'] as const;
  for (const key of allowed) {
    if (key in req.body) updatable[key] = (req.body as any)[key];
  }

  if (updatable.groupId && !isValidObjectId(String(updatable.groupId))) {
    return res.status(400).json({ ok: false, message: 'groupId inválido' });
  }

  const updated = await Card.findByIdAndUpdate(id, updatable, { new: true });
  if (!updated) return res.status(404).json({ ok: false, message: 'Card no encontrada' });

  res.json({ ok: true, data: updated });
});

// POST /api/cards/:id/hide  (enabled=false)
export const hideCard = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id || !isValidObjectId(id)) {
    return res.status(400).json({ ok: false, message: 'ID inválida' });
  }

  const updated = await Card.findByIdAndUpdate(id, { enabled: false }, { new: true });
  if (!updated) return res.status(404).json({ ok: false, message: 'Card no encontrada' });

  res.json({ ok: true, data: updated });
});

// POST /api/cards/:id/show  (enabled=true)
export const showCard = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id || !isValidObjectId(id)) {
    return res.status(400).json({ ok: false, message: 'ID inválida' });
  }

  const updated = await Card.findByIdAndUpdate(id, { enabled: true }, { new: true });
  if (!updated) return res.status(404).json({ ok: false, message: 'Card no encontrada' });

  res.json({ ok: true, data: updated });
});
