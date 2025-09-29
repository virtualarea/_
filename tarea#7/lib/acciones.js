'use server'
import { revalidatePath } from 'next/cache'
import { supabase } from './supabase'
export async function obtenerUsuarios() {
  const { data, error } = await supabase.from('usuarios').select('*').order('created_at', { ascending: false })
  if (error) {
    console.error('Error obteniendo usuarios:', error)
    return { data: null, error: error.message }
  }
  return { data, error: null }
}
export async function crearUsuario(formData) {
  const usuario = {
    nombre: formData.get('nombre'),
    edad: parseInt(formData.get('edad')),
    genero: formData.get('genero'),
    email: formData.get('email')
  }
  const { data, error } = await supabase.from('usuarios').insert([usuario]).select()
  if (error) {
    console.error('Error creando usuario:', error)
    return { success: false, error: error.message }
  }
  revalidatePath('/') 
  return { success: true, data: data[0] }
}
export async function actualizarUsuario(id, formData) {
  const updatedFields = {
      nombre: formData.get('nombre'),
      edad: parseInt(formData.get('edad')),
      genero: formData.get('genero'),
      email: formData.get('email'),
  }
  const { data, error } = await supabase.from('usuarios').update(updatedFields).eq('id', id).select()
  if (error) {
    console.error('Error actualizando usuario:', error)
    return { success: false, error: error.message }
  }
  revalidatePath('/')
  return { success: true, data: data[0] }
}
export async function eliminarUsuario(id) {
  const { error } = await supabase.from('usuarios').delete().eq('id', id)
  if (error) {
    console.error('Error eliminando usuario:', error)
    return { success: false, error: error.message }
  }
  revalidatePath('/')
  return { success: true }
}
export async function obtenerCargos() {
  const { data, error } = await supabase.from('cargos').select('*').order('cargo', { ascending: true })
  if (error) {
    console.error('Error obteniendo cargos:', error)
    return { data: null, error: error.message }
  }
  return { data, error: null }
}
export async function crearCargo(formData) {
  const cargoData = {
    cargo: formData.get('cargo'),
    sueldo: parseFloat(formData.get('sueldo'))
  }
  const { data, error } = await supabase.from('cargos').insert([cargoData]).select()
  if (error) {
    console.error('Error creando cargo:', error)
    return { success: false, error: error.message }
  }
  revalidatePath('/cargos') 
  return { success: true, data: data[0] }
}
export async function actualizarCargo(id, formData) {
  const updatedFields = {
    cargo: formData.get('cargo'),
    sueldo: parseFloat(formData.get('sueldo'))
  }
  const { data, error } = await supabase.from('cargos').update(updatedFields).eq('id', id).select()
  if (error) {
    console.error('Error actualizando cargo:', error)
    return { success: false, error: error.message }
  }
  revalidatePath('/')
  return { success: true, data: data[0] }
}
export async function eliminarCargo(id) {
  const { error } = await supabase.from('cargos').delete().eq('id', id)
  if (error) {
    console.error('Error eliminando cargo:', error)
    return { success: false, error: error.message }
  }
  revalidatePath('/')
  return { success: true }
}
export async function obtenerHorarios() {
  const { data, error } = await supabase.from('horarios').select('*').order('hora_ingreso', { ascending: true })
  if (error) {
    console.error('Error obteniendo horarios:', error)
    return { data: null, error: error.message }
  }
  return { data, error: null }
}
export async function crearHorario(formData) {
  const horarioData = {
    nombre_turno: formData.get('nombre_turno'),
    hora_ingreso: formData.get('hora_ingreso'), // TIME es un string compatible
    hora_salida: formData.get('hora_salida'),
  }
  const { data, error } = await supabase.from('horarios').insert([horarioData]).select()
  if (error) {
    console.error('Error creando horario:', error)
    return { success: false, error: error.message }
  }
  revalidatePath('/horarios') 
  return { success: true, data: data[0] }
}
export async function actualizarHorario(id, formData) {
  const updatedFields = {
    nombre_turno: formData.get('nombre_turno'),
    hora_ingreso: formData.get('hora_ingreso'),
    hora_salida: formData.get('hora_salida')
  }
  const { data, error } = await supabase.from('horarios').update(updatedFields).eq('id', id).select()
  if (error) {
    console.error('Error actualizando usuario:', error)
    return { success: false, error: error.message }
  }
  revalidatePath('/')
  return { success: true, data: data[0] }
}
export async function eliminarHorario(id) {
  const { error } = await supabase.from('horarios').delete().eq('id', id)
  if (error) {
    console.error('Error eliminando horario:', error)
    return { success: false, error: error.message }
  }
  revalidatePath('/')
  return { success: true }
}
/**
 * 9. Registrar Tickeo (Entrada o Salida)
 * @param {string} userId - UUID del usuario que marca.
 * @param {string} tipo - 'ENTRADA' o 'SALIDA'.
 */
export async function registrarTickeo(userId, tipo) {
  const now = new Date();
  const fecha = now.toISOString().split('T')[0]; // YYYY-MM-DD
  const hora = now.toTimeString().split(' ')[0]; // HH:MM:SS
  if (tipo !== 'ENTRADA' && tipo !== 'SALIDA') {
    return { success: false, error: 'El tipo de tickeo debe ser ENTRADA o SALIDA.' }
  }
  const tickeoData = {
    id_usuario: userId,
    fecha: fecha,
    hora: hora,
    tipo: tipo
  }
  const { data, error } = await supabase.from('tickeos').insert([tickeoData]).select()
  if (error) {
    console.error(`Error registrando ${tipo}:`, error)
    return { success: false, error: error.message }
  }
  revalidatePath('/asistencia') 
  return { success: true, data: data[0] }
}