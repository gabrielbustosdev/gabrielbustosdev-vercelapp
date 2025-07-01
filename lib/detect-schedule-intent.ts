// Detecta si un mensaje del asistente invita a agendar una reunión, consulta o llamada
export function shouldShowScheduleButton(message: string): boolean {
  const patterns = [
    /agendar (una )?(reuni[oó]n|consulta|llamada|videollamada|cita)/i,
    /programar (una )?(reuni[oó]n|consulta|llamada|videollamada|cita)/i,
    /quieres? (que )?(agend[ae]mos|program[ae]mos|coordin[ae]mos)/i,
    /¿te gustar[ií]a (agendar|programar|coordin[ae]mos|tener|hacer|una)? ?(reuni[oó]n|consulta|llamada|videollamada|cita)?/i,
    /puedo (agendar|programar|coordinar|enviarte un enlace para|organizar)/i,
    /agenda (aqu[ií]|una cita|una reuni[oó]n|una videollamada)/i,
    /haz click.*(agendar|programar|coordin[ae]mos|videollamada)/i,
    /si deseas? (agendar|programar|coordin[ae]mos|videollamada)/i,
    /puedes? (agendar|programar|coordin[ae]mos|videollamada)/i,
    /¿quieres? (que )?(coordin[ae]mos|reservar|agendar|programar|una videollamada|una reuni[oó]n|una consulta|una llamada|una cita)/i,
    /¿te interesa (agendar|programar|coordin[ae]mos|tener|una videollamada|una reuni[oó]n|una consulta|una llamada|una cita)/i,
    /¿te gustar[ií]a (una )?(videollamada|reuni[oó]n|consulta|llamada|cita)/i,
    /quiero (agendar|programar|coordin[ae]mos|una videollamada|una reuni[oó]n|una consulta|una llamada|una cita)/i,
    /me gustar[ií]a (agendar|programar|coordin[ae]mos|una videollamada|una reuni[oó]n|una consulta|una llamada|una cita)/i,
    /podemos (agendar|programar|coordin[ae]mos|una videollamada|una reuni[oó]n|una consulta|una llamada|una cita)/i,
    /envi[aá]me (un enlace|una invitaci[oó]n) (para )?(agendar|programar|coordin[ae]mos|una videollamada|una reuni[oó]n|una consulta|una llamada|una cita)/i,
  ];
  return patterns.some((regex) => regex.test(message));
} 