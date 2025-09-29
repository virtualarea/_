import { obtenerUsuarios, obtenerCargos, obtenerHorarios } from '@/lib/acciones';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import UserTableAndActions from '@/components/UserTableAndActions';
import CargoTableAndActions from '@/components/CargoTableAndActions';
import HorarioTableAndActions from '@/components/HorarioTableAndActions';
export default async function HomePage() {
  const [
    { data: usuarios, error: errorUsuarios },
    { data: cargos, error: errorCargos },
    { data: horarios, error: errorHorarios }
  ] = await Promise.all([
    obtenerUsuarios(),
    obtenerCargos(),
    obtenerHorarios()
  ]);
  const allErrors = [errorUsuarios, errorCargos, errorHorarios].filter(e => e !== null);
  if (allErrors.length > 0) {
    return (
      <main className="container mx-auto p-4 md:p-8">
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle>Error de Conexión ❌</CardTitle>
            <CardDescription>No se pudieron cargar los datos de la base de Supabase.</CardDescription>
          </CardHeader>
          <CardContent>
            {allErrors.map((err, index) => (
              <p key={index} className="text-red-500">Detalles: {err}</p>
            ))}
          </CardContent>
        </Card>
      </main>
    );
  }
  return (
    <main className="container mx-auto p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-bold">Sistema de Gestión de RRHH 🏢</CardTitle>
            <CardDescription>Administración de Usuarios, Cargos y Horarios de la empresa.</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="usuarios" className="w-full">
              {/* Lista de Pestañas */}
              <TabsList className="grid w-full grid-cols-3 md:w-3/4 lg:w-1/2 mb-4">
                <TabsTrigger value="usuarios">Usuarios</TabsTrigger>
                <TabsTrigger value="cargos">Cargos</TabsTrigger>
                <TabsTrigger value="horarios">Horarios</TabsTrigger>
              </TabsList>
              {/* Contenido de Pestaña: Usuarios */}
              <TabsContent value="usuarios">
                <h3 className="text-xl font-semibold mb-3">Gestión de Usuarios</h3>
                <UserTableAndActions initialUsers={usuarios || []} />
              </TabsContent>
              {/* Contenido de Pestaña: Cargos */}
              <TabsContent value="cargos">
                <h3 className="text-xl font-semibold mb-3">Gestión de Cargos</h3>
                <CargoTableAndActions initialCargos={cargos || []} />
              </TabsContent>
              {/* Contenido de Pestaña: Horarios */}
              <TabsContent value="horarios">
                <h3 className="text-xl font-semibold mb-3">Gestión de Horarios</h3>
                <HorarioTableAndActions initialHorarios={horarios || []} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}