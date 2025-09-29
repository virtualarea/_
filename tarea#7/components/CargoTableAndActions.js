'use client'; 

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PlusCircle, Pencil, Trash2, Loader2, DollarSign } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import FormularioCargo from './FormularioCargo'; // <-- Necesitamos crear este formulario
import { obtenerCargos, eliminarCargo } from '@/lib/acciones'; // Server Action READ

export default function CargoTableAndActions({ initialCargos }) {
  const [cargos, setCargos] = useState(initialCargos);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCargo, setEditingCargo] = useState(null);
  
  const [needsRefresh, setNeedsRefresh] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Efecto para re-ejecutar el fetch de datos cuando 'needsRefresh' es true
  useEffect(() => {
    if (needsRefresh) {
      const fetchUpdatedCargos = async () => {
        setIsLoading(true);
        // Llama a la Server Action desde el cliente
        const { data } = await obtenerCargos(); 
        setCargos(data || []);
        setIsLoading(false);
        setNeedsRefresh(false);
        setEditingCargo(null); 
        setIsDialogOpen(false); 
      };
      fetchUpdatedCargos();
    }
  }, [needsRefresh]);

  // Manejo de la eliminación (NOTA: La Server Action DELETE para Cargo NO está implementada aún en acciones.js)
  const handleDelete = async (cargoId) => {
    if (confirm('¿Estás seguro de que quieres eliminar este cargo?')) {
      const { success } = await eliminarCargo(cargoId);
      if (success) {
        setCargos(cargos.filter(c => c.id !== cargoId));
      } else {
        alert('Error al eliminar cargo.');
      }
    }
  };
  
  const handleOpenDialog = (cargo = null) => {
    setEditingCargo(cargo);
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
              <PlusCircle className="mr-2 h-4 w-4" /> Nuevo Cargo
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{editingCargo ? 'Editar Cargo' : 'Crear Nuevo Cargo'}</DialogTitle>
            </DialogHeader>
            {/* Pasa la data del cargo (si está editando) y un callback al formulario */}
            <FormularioCargo 
              cargo={editingCargo} 
              onFormSuccess={handleFormSuccess} 
            />
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-10">
          <Loader2 className="h-6 w-6 animate-spin mr-2" /> Cargando cargos...
        </div>
      ) : cargos.length === 0 ? (
        <p className="text-center text-gray-500 py-10">No hay cargos para mostrar. ¡Crea uno!</p>
      ) : (
        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cargo</TableHead>
                <TableHead className="w-1/4 text-right">Sueldo</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cargos.map((cargo) => (
                <TableRow key={cargo.id}>
                  <TableCell className="font-medium flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-green-600" />
                    {cargo.cargo}
                  </TableCell>
                  <TableCell className="text-right">${cargo.sueldo.toLocaleString('es-CL')}</TableCell>
                  <TableCell className="text-right flex justify-end space-x-2">
                    <Button variant="outline" size="icon" onClick={() => handleOpenDialog(cargo)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="destructive" size="icon" onClick={() => handleDelete(cargo.id)}>
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
