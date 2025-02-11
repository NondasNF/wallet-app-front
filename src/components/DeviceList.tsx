interface DeviceListProps {
  devices: any[];
  loading: boolean;
  error: string | null;
}

const DeviceList = ({ devices, loading, error }: DeviceListProps) => {
  if (loading) return <p>Carregando dispositivos...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  const getFormatedDate = (date: string) => {
    return new Date(date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) + ' - ' + new Date(date).toLocaleDateString('pt-BR');
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <h3 className="text-xl font-semibold mb-4">Dispositivos Logados</h3>
      {devices.length === 0 ? (
        <p>Nenhum dispositivo logado.</p>
      ) : (
        <ul>
          {devices.map((device, index) => (
            <li key={index} className="mb-2 flex justify-between items-center">
              <div>
                {device.name} - Ultimo Acesso: {getFormatedDate(device.last_used_at)} 
              </div>
              <button
                className="bg-red-500 text-white px-2 rounded-md hover:bg-red-600"
              >
                Desconectar
              </button>
              </li>
            ))}
          </ul>
      )}
    </div>
  );
};

export default DeviceList;
