const os = require('os');

function getLocalIp() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name] || []) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return '192.168.x.x';
}

const localIp = getLocalIp();

console.log('\n🌿 ============================================================');
console.log('   Plant Doctor is running - AI Agronomy & Vision Platform');
console.log('============================================================');
console.log(`  Local:   http://localhost:3000`);
console.log(`  Network: http://${localIp}:3000`);
console.log('============================================================');
console.log('  Windows Firewall Notice:');
console.log('  When connecting another device on the same Wi-Fi, Windows Firewall');
console.log('  may prompt for permission. Allow Node.js on Private networks.');
console.log('============================================================\n');
