import { ILogger, IAlertService } from '../interfaces';

// DIP: Реалізації інфраструктури (модулі низького рівня)
export class RemoteSyslogServer implements ILogger {
    log(message: string): void {
        console.log(`[Remote Syslog] ${message}`);
    }
}

export class EmailAlertService implements IAlertService {
    alert(message: string): void {
        console.log(`[Email Alert] ${message}`);
    }
}