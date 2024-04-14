export type User = {
    _id: string;
    name: string;
    email: string;
    role: string;
    image: string;
    gooleId: string;
    customerId: string;
    isVerified: boolean;
    accountType: string;
    cards: {
        total: number;
        created: number;
    }
    activePlan: {
        _id: string;
        status: string;
    }
};

export type Tree = {
    _id: string;
    name: string
    scientificName: string;
    treeType: string;
    location: string;
    description: string;
    features: string;
    maintenance: string;
    benefits: string;
    funFact: string;
    user: string;
};

export type Payment = {
    _id: string;
    amount: number;
    plan: string;
    paymentDate: Date;
    paymentStatus: String;
    paymentValidity: Date;
    razorpayOrderId: string;
    razorpayPaymentId: string; 
    razorpaySignature: string;
    user: string;
};

export type Animal = {
    _id: string;
    species: string;
    name: string;
    age: number;
    gender: string;
    color: string;
    location: string;
    owner: string;
    phone:  number;
    user: string;
}

export type Personal = {
    _id: string;
    name: string;
    contactInfo: any;
    socialMedia: any;
    aboutMe: any;
    preferences: any;
    lifeStyle: any;
    beliefs: any;       
    professional: any;
    additional: any;
    user: string;
}

export type MedicalType = {
    _id: string;
    personalInfo: any;
    healthHistory: any;
    currentMedication: string;
    previousSurgeries: string;
    healthHabits: any;
    insuranceInfo: any;
    user: string;
}

export type Creator = {
    _id: string;
    name: string;
    links: any;
    user: string;
}