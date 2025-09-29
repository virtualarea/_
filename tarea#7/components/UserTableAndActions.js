'use client'; 

import React, { useState, useEffect } from 'react'; // Importamos useEffect
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PlusCircle, Pencil, Trash2, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import FormularioUsuario from './FormularioUsuario'; 
import { eliminarUsuario, obtenerUsuarios } from '@/lib/acciones'; // <-- Importamos obtenerUsuarios

export default function UserTableAndActions({ initialUsers }) {
  const [users, setUsers] = useState(initialUsers);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  
  // 1. Estado para forzar la recarga
  const [needsRefresh, setNeedsRefresh] = useState(false);
  const [isLoading, setIsLoading] = useState(false);


  // 2. Efecto para re-ejecutar el fetch de datos cuando 'needsRefresh' es true
  useEffect(() => {
    if (needsRefresh) {
      const fetchUpdatedUsers = async () => {
        setIsLoading(true); // Mostrar loading
        const { data } = await obtenerUsuarios(); // Llama a la Server Action desde el cliente
        setUsers(data || []);
        setIsLoading(false); // Ocultar loading
        setNeedsRefresh(false); // Reinicia la bandera
        setEditingUser(null); // Limpia el usuario en edición
        setIsDialogOpen(false); // Cierra el diálogo automáticamente
      };
      fetchUpdatedUsers();
    }
  }, [needsRefresh]);

  // Implementación de la eliminación
  const handleDelete = async (userId) => {
    if (confirm('¿Estás seguro de que quieres eliminar a este usuario? Esta acción es irreversible.')) {
      const { success } = await eliminarUsuario(userId);
      if (success) {
        // Actualización optimista de la UI para la eliminación
        setUsers(users.filter(u => u.id !== userId));
      } else {
        alert('Error al eliminar usuario.');
      }
    }
  };
  
  // Abrir diálogo de creación o edición
  const handleOpenDialog = (user = null) => {
    setEditingUser(user);
    setIsDialogOpen(true);
  };
  
  // 3. Función de éxito que establece la bandera 'needsRefresh'
  const handleFormSuccess = () => {
    setNeedsRefresh(true);
    // Nota: El diálogo se cerrará en el useEffect tras la recarga exitosa.
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog(null)}>
              <PlusCircle className="mr-2 h-4 w-4" /> Nuevo Usuario
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{editingUser ? 'Editar Usuario' : 'Crear Nuevo Usuario'}</DialogTitle>
            </DialogHeader>
            {/* 4. Pasa la nueva función de callback al formulario */}
            <FormularioUsuario 
              usuario={editingUser} 
              onFormSuccess={handleFormSuccess} 
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Indicador de carga mientras se refrescan los datos */}
      {isLoading ? (
        <div className="flex justify-center items-center py-10">
          <Loader2 className="h-6 w-6 animate-spin mr-2" /> Cargando datos actualizados...
        </div>
      ) : users.length === 0 ? (
        <p className="text-center text-gray-500 py-10">No hay usuarios para mostrar. ¡Crea uno!</p>
      ) : (
        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Edad</TableHead>
                <TableHead>Género</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.nombre}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.edad}</TableCell>
                  <TableCell>{user.genero}</TableCell>
                  <TableCell className="text-right flex justify-end space-x-2">
                    <Button variant="outline" size="icon" onClick={() => handleOpenDialog(user)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="destructive" size="icon" onClick={() => handleDelete(user.id)}>
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
