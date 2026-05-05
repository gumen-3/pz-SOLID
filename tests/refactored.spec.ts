import { NetworkOrchestrator, CiscoCatalystSwitch, NextGenFirewall } from '../src/refactored/networkDevices';
import { ILogger, IAlertService, IDeviceConfigurator } from '../src/interfaces';

describe('NetworkOrchestrator (SOLID Refactored)', () => {
    let mockLogger: ILogger;
    let mockAlerter: IAlertService;
    let mockConfigurator: IDeviceConfigurator;
    let orchestrator: NetworkOrchestrator;

    beforeEach(() => {
        // DIP: Ін'єкція залежностей за допомогою мок-об'єктів
        mockLogger = { log: jest.fn() };
        mockAlerter = { alert: jest.fn() };
        mockConfigurator = { generateConfigTemplate: jest.fn().mockReturnValue('STANDARD_CONFIG') };

        orchestrator = new NetworkOrchestrator(mockLogger, mockAlerter);
    });

    it('should deploy configuration to a Catalyst Switch correctly', () => {
        const switchDevice = new CiscoCatalystSwitch('192.168.1.10', mockConfigurator);

        orchestrator.deploy(switchDevice);

        expect(mockConfigurator.generateConfigTemplate).toHaveBeenCalled();
        expect(mockLogger.log).toHaveBeenCalledWith(expect.stringContaining('Success deployment on 192.168.1.10'));
        expect(mockLogger.log).toHaveBeenCalledWith(expect.stringContaining('STANDARD_CONFIG'));
        expect(mockAlerter.alert).toHaveBeenCalledWith(expect.stringContaining('192.168.1.10'));
    });

    it('should deploy configuration to a Firewall correctly (LSP & OCP compliance)', () => {
        const firewall = new NextGenFirewall('10.0.0.1', mockConfigurator);

        orchestrator.deploy(firewall);

        expect(mockLogger.log).toHaveBeenCalledWith(expect.stringContaining('Success deployment on 10.0.0.1'));
        expect(mockLogger.log).toHaveBeenCalledWith(expect.stringContaining('Firewall rules applied'));
    });

    it('should handle specific ISP interface method independently', () => {
        const switchDevice = new CiscoCatalystSwitch('192.168.1.11', mockConfigurator);
        const vlanStatus = switchDevice.assignVlan(10);

        expect(vlanStatus).toBe('VLAN 10 activated on switch ports.');
        // Фаєрвол навіть не має цього методу, що доводить виконання ISP.
    });
});