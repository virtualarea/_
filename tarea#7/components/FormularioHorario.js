'use client'

import { useFormStatus } from 'react-dom'; 
// Importaciones de shadcn/ui
import { Button } from '@/components/ui/button'; 
import { CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input'; 
import { Label } from '@/components/ui/label'; 
import { Loader2 } from 'lucide-react'; 

// Importamos la Server Action para la creación 
import { crearHorario, actualizarHorario } from '@/lib/acciones'; 

// Componente auxiliar para el botón de envío y el estado de carga
function SubmitButton({ isEditing }) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending} className="flex-1">
      {pending ? (<><Loader2 className="h-4 w-4 animate-spin mr-2" /> Guardando...</>) : (isEditing ? 'Actualizar Horario' : 'Crear Horario')}
    </Button>
  );
}

export default function FormularioHorario({ horario = null, onFormSuccess }) {
  
  const isEditing = !!horario;

  // Define la Server Action a ejecutar: Crear o Actualizar (usando placeholder temporal)
  const action = isEditing 
    ? actualizarHorario.bind(null, horario.id) 
    : crearHorario; 

  const formActionHandler = async (formData) => {
    const result = await action(formData);

    if (result.success) {
      // Llama a la función de éxito para cerrar el diálogo y refrescar la tabla
      onFormSuccess && onFormSuccess(); 
    } else {
      console.error(`Error al guardar el horario: ${result.error}`);
      alert(`Error: ${result.error || 'Hubo un error al procesar la solicitud.'}`); 
    }
  };

  return (
    <CardContent>
        {/* Formulario que llama a la Server Action */}
        <form action={formActionHandler} className="space-y-4"> 
            
            {/* Campo: Nombre del Turno (Nuevo campo sugerido) */}
            <div className="space-y-2">
                <Label htmlFor='nombre_turno'>Nombre del Turno</Label>
                <Input 
                    name='nombre_turno' 
                    id='nombre_turno' 
                    placeholder='Ej: Turno Diurno' 
                    required 
                    type='text' 
                    defaultValue={horario?.nombre_turno || ''} 
                />
            </div>

            {/* Campo: Hora de Ingreso */}
            <div className="space-y-2">
                <Label htmlFor='hora_ingreso'>Hora de Ingreso</Label>
                <Input 
                    name='hora_ingreso' 
                    id='hora_ingreso' 
                    required 
                    type='time' 
                    // El formato de Supabase (HH:MM:SS) es compatible con input type="time" (HH:MM)
                    defaultValue={horario?.hora_ingreso ? horario.hora_ingreso.substring(0, 5) : ''} 
                />
            </div>
            
            {/* Campo: Hora de Salida */}
            <div className="space-y-2">
                <Label htmlFor='hora_salida'>Hora de Salida</Label>
                <Input 
                    name='hora_salida' 
                    id='hora_salida' 
                    required 
                    type='time' 
                    defaultValue={horario?.hora_salida ? horario.hora_salida.substring(0, 5) : ''} 
                />
            </div>
            
            <div className="flex gap-2 pt-4"> 
                <SubmitButton isEditing={isEditing} />
            </div>
        </form>
    </CardContent>
  );
}
