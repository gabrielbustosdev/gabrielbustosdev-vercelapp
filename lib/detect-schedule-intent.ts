// Detecta si un mensaje del asistente invita a agendar una reunión, consulta o llamada
export function shouldShowScheduleButton(message: string): boolean {
  const patterns = [
    /agendar (una )?(reunión|consulta|llamada)/i,
    /programar (una )?(reunión|consulta|llamada)/i,
    /quieres? (que )?(agend[ae]mos|program[ae]mos)/i,
    /¿te gustaría (agendar|programar)/i,
    /puedo (agendar|programar)/i,
    /agenda (aquí|una cita)/i,
    /haz click.*(agendar|programar)/i,
    /si deseas? (agendar|programar)/i,
    /puedes? (agendar|programar)/i,
    /¿quieres? que coordinemos/i,
    /¿quieres? reservar/i,
    /¿quieres? una reunión/i,
    /¿quieres? una consulta/i,
    /¿quieres? una llamada/i,
  ];
  return patterns.some((regex) => regex.test(message));
} 