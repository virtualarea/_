'use client'

import { useFormStatus } from 'react-dom'; 
// Importaciones de shadcn/ui
import { Button } from '@/components/ui/button'; 
import { CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input'; 
import { Label } from '@/components/ui/label'; 
import { Loader2 } from 'lucide-react'; 

// Importamos la Server Action para la creación (y asumimos la actualización)
import { crearCargo, actualizarCargo } from '@/lib/acciones'; 

// Componente auxiliar para el botón de envío y el estado de carga
function SubmitButton({ isEditing }) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending} className="flex-1">
      {pending ? (<><Loader2 className="h-4 w-4 animate-spin mr-2" /> Guardando...</>) : (isEditing ? 'Actualizar Cargo' : 'Crear Cargo')}
    </Button>
  );
}

export default function FormularioCargo({ cargo = null, onFormSuccess }) {
  
  const isEditing = !!cargo;

  // Define la Server Action a ejecutar: Crear o Actualizar (usando placeholder temporal)
  const action = isEditing 
    ? actualizarCargo.bind(null, cargo.id) 
    : crearCargo; 

  const formActionHandler = async (formData) => {
    const result = await action(formData);

    if (result.success) {
      // Llama a la función de éxito para cerrar el diálogo y refrescar la tabla
      onFormSuccess && onFormSuccess(); 
    } else {
      console.error(`Error al guardar el cargo: ${result.error}`);
      // Reemplazamos alert() por un mensaje en consola y una notificación de error si estuviera disponible
      alert(`Error: ${result.error || 'Hubo un error al procesar la solicitud.'}`); 
    }
  };

  return (
    <CardContent>
        {/* Formulario que llama a la Server Action */}
        <form action={formActionHandler} className="space-y-4"> 
            
            {/* Campo: Cargo (Nombre del puesto) */}
            <div className="space-y-2">
                <Label htmlFor='cargo'>Nombre del Cargo</Label>
                <Input 
                    name='cargo' 
                    id='cargo' 
                    placeholder='Ej: Desarrollador Senior' 
                    required 
                    type='text' 
                    defaultValue={cargo?.cargo || ''} 
                />
            </div>
            
            {/* Campo: Sueldo */}
            <div className="space-y-2">
                <Label htmlFor='sueldo'>Sueldo Base ($)</Label>
                <Input 
                    name='sueldo' 
                    id='sueldo' 
                    placeholder='Ej: 85000.00' 
                    required 
                    type='number' 
                    step="0.01" 
                    min="0" 
                    defaultValue={cargo?.sueldo || ''} 
                />
            </div>
            
            <div className="flex gap-2 pt-4"> 
                <SubmitButton isEditing={isEditing} />
            </div>
        </form>
    </CardContent>
  );
}
