// log.js
export let incidentLog = [];

export function addLog(message, type = 'info', timeText = null) {
  const entry = {
    time: timeText ?? new Date().toLocaleTimeString(),
    message,
    type
  };
  incidentLog.push(entry);
  const logEl = document.getElementById('scenario-log');
  if (logEl) {
    const cls = type === 'good' ? 'border-green-500' :
                type === 'bad' ? 'border-red-500' :
                type === 'command' ? 'border-amber-500' : 'border-gray-500';
    logEl.innerHTML += `<div class="border-l-4 ${cls} pl-2 text-sm"><span class="text-gray-400">[${entry.time}]</span> ${entry.message}</div>`;
    logEl.scrollTop = logEl.scrollHeight;
  }
}
export function clearLog() { incidentLog = []; }
