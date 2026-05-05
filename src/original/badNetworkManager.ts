// Порушення ISP: Інтерфейс вимагає реалізації методів, невластивих для всіх пристроїв
export interface INetworkOperations {
    assignVlan(vlanId: number): void;
    routeTraffic(destinationIp: string): void;
    blockMalware(signature: string): void; // Звичайний комутатор не вміє блокувати малвар
}

// Порушення DIP: Жорстка прив'язка до конкретних сервісів інфраструктури
class LocalSyslog {
    writeLog(msg: string) { console.log("Local Syslog: ", msg); }
}

class AdminSmsAlert {
    sendSms(msg: string) { console.log(`SMS to Admin: ${msg}`); }
}

// Порушення SRP: Клас обробляє конфігурацію, логування та сповіщення.
export class BadNetworkManager implements INetworkOperations {
    private syslog = new LocalSyslog();
    private alert = new AdminSmsAlert();

    public deployConfiguration(deviceType: string, ip: string, config: any) {
        // Порушення OCP: Додавання нового пристрою (наприклад, LoadBalancer) вимагає зміни цього методу
        if (deviceType === "CiscoSwitch") {
            console.log(`Applying VLAN config to Switch at ${ip}`);
        } else if (deviceType === "Firewall") {
            console.log(`Applying security rules to Firewall at ${ip}`);
        } else {
            throw new Error("Unknown network device type");
        }

        this.syslog.writeLog(`Device ${deviceType} at ${ip} configured.`);
        this.alert.sendSms(`Alert: Config changed on ${deviceType}.`);
    }

    public assignVlan(vlanId: number): void { console.log(`VLAN ${vlanId} assigned`); }
    public routeTraffic(ip: string): void { console.log(`Routing to ${ip}`); }
    public blockMalware(sig: string): void { console.log(`Blocking signature ${sig}`); }
}

// Порушення LSP: Нащадок ламає логіку базового класу (некерований комутатор не підтримує VLAN, але викидає виняток замість безпечної обробки)
export class UnmanagedSwitch extends BadNetworkManager {
    public assignVlan(vlanId: number): void {
        throw new Error("Unmanaged switches do not support VLAN configuration!");
    }
}