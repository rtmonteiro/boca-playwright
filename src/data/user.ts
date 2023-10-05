export interface UserModel {
    userSiteNumber?: string;
    userNumber: string;
    userName: string;
    userIcpcId?: string;
    userType: 'Team' | 'Judge' | 'Admin' | 'Staff' | 'Score' | 'Site';
    userEnabled?: 'Yes' | 'No';
    userMultiLogin?: 'Yes' | 'No';
    userFullName: string;
    userDesc: string;
    userIp?: string;
    userPassword?: string;
    userChangePass?: 'Yes' | 'No';
}

export const user: UserModel = {
    userSiteNumber: '1',
    userNumber: '2019202359',
    userName: 'ryanmonteiro',
    userType: 'Team',
    userFullName: 'Ryan Tavares Farias da Silva Monteiro',
    userDesc: 'Ryan Tavares Farias da Silva Monteiro',
    userPassword: 'boca',
    userChangePass: 'Yes',
}
