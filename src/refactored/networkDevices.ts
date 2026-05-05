import { IDeviceConfigurator, IVlanConfigurable, ISecurityAppliance, ILogger, IAlertService } from '../interfaces';

// LSP: Базовий абстрактний клас пристрою
export abstract class NetworkDevice {
    constructor(
        public ipAddress: string,
        public configurator: IDeviceConfigurator
    ) {}

    // Кожен пристрій поліморфно застосовує свої налаштування
    abstract applyConfiguration(): string;
}

// OCP: Легко додавати нові класи пристроїв без зміни оркестратора
export class CiscoCatalystSwitch extends NetworkDevice implements IVlanConfigurable {
    applyConfiguration(): string {
        const template = this.configurator.generateConfigTemplate();
        return `Switch configured with template: ${template}`;
    }

    assignVlan(vlanId: number): string {
        return `VLAN ${vlanId} activated on switch ports.`;
    }
}

export class NextGenFirewall extends NetworkDevice implements ISecurityAppliance {
    applyConfiguration(): string {
        const template = this.configurator.generateConfigTemplate();
        return `Firewall rules applied via template: ${template}`;
    }

    blockThreat(signature: string): string {
        return `Traffic matching signature ${signature} dropped.`;
    }
}

// SRP: Цей клас відповідає ВИКЛЮЧНО за оркестрацію (застосування налаштувань, логування, сповіщення)
export class NetworkOrchestrator {
    constructor(
        private logger: ILogger,
        private alerter: IAlertService
    ) {}

    public deploy(device: NetworkDevice): void {
        try {
            const status = device.applyConfiguration();

            this.logger.log(`Success deployment on ${device.ipAddress}. Details: ${status}`);
            this.alerter.alert(`Configuration updated on device ${device.ipAddress}`);
        } catch (error: any) {
            this.logger.log(`Failed to deploy on ${device.ipAddress}. Error: ${error.message}`);
            throw error;
        }
    }
}