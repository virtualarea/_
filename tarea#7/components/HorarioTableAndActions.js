'use client'; 

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PlusCircle, Pencil, Trash2, Loader2, Clock } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import FormularioHorario from './FormularioHorario'; // <-- Necesitamos crear este formulario
import { obtenerHorarios, eliminarHorario } from '@/lib/acciones'; // Server Action READ

export default function HorarioTableAndActions({ initialHorarios }) {
  const [horarios, setHorarios] = useState(initialHorarios);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingHorario, setEditingHorario] = useState(null);
  
  const [needsRefresh, setNeedsRefresh] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Efecto para re-ejecutar el fetch de datos cuando 'needsRefresh' es true
  useEffect(() => {
    if (needsRefresh) {
      const fetchUpdatedHorarios = async () => {
        setIsLoading(true);
        // Llama a la Server Action desde el cliente
        const { data } = await obtenerHorarios(); 
        setHorarios(data || []);
        setIsLoading(false);
        setNeedsRefresh(false);
        setEditingHorario(null); 
        setIsDialogOpen(false); 
      };
      fetchUpdatedHorarios();
    }
  }, [needsRefresh]);

  // Manejo de la eliminación (NOTA: La Server Action DELETE para Horario NO está implementada aún en acciones.js)
  const handleDelete = async (horarioId) => {
    if (confirm('¿Estás seguro de que quieres eliminar este horario?')) {
      const { success } = await eliminarHorario(horarioId);
      if (success) {
        setHorarios(horarios.filter(h => h.id !== horarioId));
      } else {
        alert('Error al eliminar horario.');
      }
    }
  };
  
  const handleOpenDialog = (horario = null) => {
    setEditingHorario(horario);
    setIsDialogOpen(true);
  };
  
  // Función de éxito que establece la bandera 'needsRefresh'
  const handleFormSuccess = () => {
    setNeedsRefresh(true);
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog(null)}>
              <PlusCircle className="mr-2 h-4 w-4" /> Nuevo Horario
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{editingHorario ? 'Editar Horario' : 'Crear Nuevo Horario'}</DialogTitle>
            </DialogHeader>
            {/* Pasa la data del horario (si está editando) y un callback al formulario */}
            <FormularioHorario 
              horario={editingHorario} 
              onFormSuccess={handleFormSuccess} 
            />
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-10">
          <Loader2 className="h-6 w-6 animate-spin mr-2" /> Cargando horarios...
        </div>
      ) : horarios.length === 0 ? (
        <p className="text-center text-gray-500 py-10">No hay horarios para mostrar. ¡Crea uno!</p>
      ) : (
        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Turno</TableHead>
                <TableHead className="w-1/4">Entrada</TableHead>
                <TableHead className="w-1/4">Salida</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {horarios.map((horario) => (
                <TableRow key={horario.id}>
                  <TableCell className="font-medium flex items-center gap-2">
                    <Clock className="h-4 w-4 text-blue-600" />
                    {horario.nombre_turno || 'Sin Nombre'}
                  </TableCell>
                  <TableCell>{horario.hora_ingreso.substring(0, 5)}</TableCell>
                  <TableCell>{horario.hora_salida.substring(0, 5)}</TableCell>
                  <TableCell className="text-right flex justify-end space-x-2">
                    <Button variant="outline" size="icon" onClick={() => handleOpenDialog(horario)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="destructive" size="icon" onClick={() => handleDelete(horario.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
