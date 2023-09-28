export interface UsuarioModel {
    userId: string;
    userName: string;
    userFullName: string;
    userDesc: string;
    userIp: string;
    userIcpcId: string;
    userSiteNumber: string;
    userNumber: string;
    userType: 'Team' | 'Judge' | 'Admin' | 'Staff' | 'Score' | 'Site';
    userEnabled: 'Yes' | 'No';
    userMultiLogin: 'Yes' | 'No';
    userPassword: string;
    userChangePass: 'Yes' | 'No';
    adminPassword: string;
}

export const user: UsuarioModel = {
    userId: '2019202359',
    userName: 'ryanmonteiro',
    userFullName: 'Ryan Tavares Farias da Silva Monteiro',
    userDesc: 'Ryan Tavares Farias da Silva Monteiro',
    userIp: '',
    userIcpcId: '',
    userSiteNumber: '1',
    userNumber: '2019202359',
    userType: 'Team',
    userEnabled: 'Yes',
    userMultiLogin: 'No',
    userPassword: 'boca',
    userChangePass: 'Yes',
    adminPassword: 'boca',
}