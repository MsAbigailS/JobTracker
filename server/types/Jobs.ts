export interface Jobs {
    _id: string;
    role: string;
    company: string;
    dateApplied: string;
    status: status;
    notes: string;
    location: string;
    workArrangement: workArrangement;
    link: string;
    type: workType;
    salaryType: salaryType;
    salary: string;
}

export enum workArrangement {
    remote = 'remote',
    onSite = 'on-site',
    hybrid = 'hybrid'
}

export enum status {
    applied = 'applied',
    interviewing = 'interviewing',
    offer = 'offer',
    rejected = 'rejected'
}

export enum workType {
    fullTime = 'full-time',
    partTime = 'part-time',
    contract = 'contract',
    internship = 'internship'
}

export enum salaryType {
    hourly = 'hourly',
    monthly = 'monthly',
    yearly = 'yearly'
}