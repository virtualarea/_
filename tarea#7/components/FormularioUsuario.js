// components/FormularioUsuario.js
'use client'

import { useRouter } from 'next/navigation'; // <-- PASO 1: Importar useRouter
import { useFormStatus } from 'react-dom'; // <-- PASO 2: Importar useFormStatus para el estado de carga

// Asegúrate de que las rutas de importación coincidan con tu proyecto shadcn/ui
import { Button } from '@/components/ui/button'; 
import { CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input'; // Componente Input de shadcn/ui
import { Label } from '@/components/ui/label'; // Componente Label de shadcn/ui

import { crearUsuario, actualizarUsuario } from '@/lib/acciones'; 

// Componente auxiliar para el botón de envío y el estado de carga
function SubmitButton({ isEditing }) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending} className="flex-1">
      {pending ? 'Guardando...' : (isEditing ? 'Actualizar' : 'Crear')}
    </Button>
  );
}


export default function FormularioUsuario({ usuario = null, onFormSuccess }) {
  // Las props onSubmit, onCancel e isLoading son reemplazadas por onFormSuccess
  const router = useRouter(); // <-- 3. Inicializar el router
  const isEditing = !!usuario;

  // Define la Server Action a ejecutar
  const action = isEditing ? 
      actualizarUsuario.bind(null, usuario.id) : 
      crearUsuario;

  // PASO 4: Función manejadora en el cliente para interceptar el envío del formulario
  const formActionHandler = async (formData) => {
    // Ejecuta la Server Action (Crear o Actualizar)
    const result = await action(formData);

    if (result.success) {
      // PASO 5: SOLUCIÓN CLAVE: Forzar la actualización de la data en el Server Component
      router.refresh(); 
      
      // Llamar al callback para que el componente padre cierre el Dialog
      onFormSuccess && onFormSuccess(); 
      
      // Aquí se puede añadir una notificación de éxito (e.g., toast)
    } else {
      // Manejo de errores
      alert(`Error al guardar el usuario: ${result.error}`);
    }
  };

  return (
    <CardContent>
        {/* PASO 6: Asigna el manejador de acción al formulario */}
        <form action={formActionHandler} className="space-y-4"> 
            
            {/* Inputs con Label para accesibilidad y defaultValue para edición */}
            <div className="space-y-2">
                <Label htmlFor='nombre'>Nombre</Label>
                <Input name='nombre' id='nombre' placeholder='Nombre' required type='text' defaultValue={usuario?.nombre || ''} />
            </div>
            <div className="space-y-2">
                <Label htmlFor='edad'>Edad</Label>
                <Input name='edad' id='edad' placeholder='Edad' required type='number' min="1" max="120" defaultValue={usuario?.edad || ''} />
            </div>
            <div className="space-y-2">
                <Label htmlFor='genero'>Género</Label>
                <Input name='genero' id='genero' placeholder='Género' required type='text' defaultValue={usuario?.genero || ''} />
            </div>
            <div className="space-y-2">
                <Label htmlFor='email'>Email</Label>
                <Input name='email' id='email' placeholder='Email' required type='email' defaultValue={usuario?.email || ''} />
            </div>
            
            <div className="flex gap-2 pt-4"> 
                {/* Usa el componente SubmitButton para mostrar el estado 'Guardando...' */}
                <SubmitButton isEditing={isEditing} />
            </div>
        </form>
    </CardContent>
  );
}