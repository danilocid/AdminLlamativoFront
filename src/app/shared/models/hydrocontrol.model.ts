export interface Hydrocontrol {
  agua: {
    temperatura: number;
  };
  exterior: {
    temperatura: number;
    humedad: number;
  };
  interior: {
    temperatura: number;
    humedad: number;
  };
  timeStamp: {
    count: number;
    day: number;
    hora: number;
    minutos: number;
    time: string;
    timeStamp: string;
    date: string;
    dateString;
  };
  reles: {
    bomba: string;
    bombaRele: number;
    luz: string;
    luzRele: number;
  };
}
