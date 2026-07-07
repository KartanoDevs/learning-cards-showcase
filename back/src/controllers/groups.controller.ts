import { Request, Response } from 'express';
import { Group } from '../models/Group';
import { asyncHandler } from '../utils/asyncHandler';
import { isValidObjectId } from '../utils/validateObjectId';

// GET /api/groups?enabled=true
export const listGroups = asyncHandler(async (req: Request, res: Response) => {
  const { enabled } = req.query as { enabled?: string };
  const filter: any = {};
  if (enabled !== undefined) filter.enabled = enabled === 'true';

  const groups = await Group.find(filter).sort({ order: 1, name: 1 });
  res.json({ ok: true, data: groups });
});

// GET /api/groups/:id
export const getGroupById = asyncHandler( async ( req: Request, res: Response ) =>
{
  const { id } = req.params;

  if ( !id || !isValidObjectId( id ) )
  {
    return res.status( 400 ).json( { ok: false, message: 'ID inválida' } );
  }

  const group = await Group.findById( id );
  if ( !group )
  {
    return res.status( 404 ).json( { ok: false, message: 'Group no encontrado' } );
  }

  res.json( { ok: true, data: group } );
} );

// --- INICIO DE LA CORRECCIÓN (Arregla el POST 500) ---

// POST /api/groups
export const createGroup = asyncHandler(async (req: Request, res: Response) => {
  // 1. Leemos 'description' del body
  const { name, slug, iconUrl, order, enabled, description, fav } = req.body;

  if (!name || !slug) {
    return res.status(400).json({ ok: false, message: 'name y slug son obligatorios' });
  }
  
  const finalSlug = String(slug).trim().toLowerCase();

  // 2. Comprobamos si el slug ya existe para evitar el error 500
  const existingGroup = await Group.findOne({ slug: finalSlug });
  if (existingGroup) {
    // 409 Conflict: Es un error más descriptivo que 500
    return res.status(409).json({ ok: false, message: 'El "slug" (basado en el nombre) ya existe' }); 
  }

  // 3. Añadimos 'description' a la creación
  const group = await Group.create({
    name: String(name).trim(),
    slug: finalSlug,
    description: description ?? '', // <-- CORREGIDO
    iconUrl: iconUrl ?? null,
    order: typeof order === 'number' ? order : 0,
    enabled: enabled ?? true,
    fav: fav ?? false,
  });

  res.status(201).json({ ok: true, data: group });
});

// --- FIN DE LA CORRECCIÓN ---


// PATCH /api/groups/:id/name (Esta ya no se usará, pero no molesta)
export const updateGroupName = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name } = req.body;

  if (!id || !isValidObjectId(id)) {
    return res.status(400).json({ ok: false, message: 'ID inválida' });
  }
  if (!name) {
    return res.status(400).json({ ok: false, message: 'name es obligatorio' });
  }

  const updated = await Group.findByIdAndUpdate(id, { name: String(name).trim() }, { new: true });
  if (!updated) return res.status(404).json({ ok: false, message: 'Group no encontrado' });

  res.json({ ok: true, data: updated });
});

// POST /api/groups/:id/hide  (enabled=false)
export const hideGroup = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id || !isValidObjectId(id)) {
    return res.status(400).json({ ok: false, message: 'ID inválida' });
  }

  const updated = await Group.findByIdAndUpdate(id, { enabled: false }, { new: true });
  if (!updated) return res.status(404).json({ ok: false, message: 'Group no encontrado' });

  res.json({ ok: true, data: updated });
});

// POST /api/groups/:id/show  (enabled=true)
export const showGroup = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id || !isValidObjectId(id)) {
    return res.status(400).json({ ok: false, message: 'ID inválida' });
  }

  const updated = await Group.findByIdAndUpdate(id, { enabled: true }, { new: true });
  if (!updated) return res.status(404).json({ ok: false, message: 'Group no encontrado' });

  res.json({ ok: true, data: updated });
});


// Esta es la nueva función que Angular necesita (ya la tenías bien)
// PATCH /api/groups/:id
export const updateGroup = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, description, fav } = req.body; // Obtenemos name, description y FAV del body

  if (!id || !isValidObjectId(id)) {
    return res.status(400).json({ ok: false, message: 'ID inválida' });
  }

  // Construimos el payload de actualización dinámicamente
  const updateData: any = {};
  if (name !== undefined) updateData.name = String(name).trim();
  if (description !== undefined) updateData.description = String(description).trim();
  if ( fav !== undefined ) updateData.fav = Boolean( fav );

  // Si no se envió nada para actualizar (ej. body vacío)
  if (Object.keys(updateData).length === 0) {
    // Aceptamos un payload vacío (simplemente no hace nada y devuelve OK)
    // Esto coincide con la lógica del frontend
    const group = await Group.findById(id);
    if (!group) return res.status(404).json({ ok: false, message: 'Group no encontrado' });
    return res.json({ ok: true, data: group });
  }

  const updated = await Group.findByIdAndUpdate(id, updateData, { new: true });
  
  if (!updated) {
    return res.status(404).json({ ok: false, message: 'Group no encontrado' });
  }

  res.json({ ok: true, data: updated });
});