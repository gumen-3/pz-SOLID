// ISP: Вузькоспеціалізовані інтерфейси
export interface IVlanConfigurable {
    assignVlan(vlanId: number): string;
}

export interface IRoutable {
    routeTraffic(ip: string): string;
}

export interface ISecurityAppliance {
    blockThreat(signature: string): string;
}

// DIP: Абстракції для інфраструктури
export interface ILogger {
    log(message: string): void;
}

export interface IAlertService {
    alert(message: string): void;
}

// OCP: Абстракція для стратегії конфігурації
export interface IDeviceConfigurator {
    generateConfigTemplate(): string;
}