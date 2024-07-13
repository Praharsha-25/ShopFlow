export class Owner {
    id?: number;
    email?: string;
    pwd?: string;
    dob: string; 
    firstName?: string;
    lastName?: string;
    gender?: string;

    constructor() {
        this.dob = this.formatDate(new Date());
    }

    private formatDate(date: Date): string {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
    }
}
