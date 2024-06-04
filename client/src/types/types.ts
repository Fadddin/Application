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

export type Subscription = {
    _id: string;
    planId: {
        _id: string;
        name: string;
        amount: number;
    }
    razorSubscriptionId: string;
    start: Date;
    end: Date;
    nextBilling: Date;
    totalCount: number;
    paidCount: number;
    remainingCount: number;
    shortUrl: string;
    status: string;
    user: string;
}

export type Transaction = {
    _id: string;
    amount: number;
    start: Date;
    end: Date;
    status: string;
    razorpayOrderId: string;
    razorpayPaymentId: string;
    paymentMethod: any;
    user: string;
}

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
    name: string,
    mobileNumer: string,
    homeNumber: string,
    workNumber: string,
    otherNumber: string,
    personalEmail: string,
    workEmail: string,
    otherEmail: string,
    aboutMe: string,
    dateOfBirth: Date,
    homeTown: string,
    currentCity: string,
    languages: string,
    music: string,
    color: string,
    city: string,
    travelDestination: string,
    season: string,
    uniqueSkills: string,
    cuisine: string,
    beverage: string,
    inspirationalQuotes: string,
    funnyQuotes: string,
    motivationalQuotes: string,
    otherQuotes: string,
    travelMode: string,
    petLover: string,
    partyEnthusiast: string,
    smoker: string,
    maritalStatus: string,
    relationshipStatus: string,
    fitnessRoutine: string,
    morningPerson: string,
    diet: string,
    sleepingHabit: string,
    genre: string,
    sports: string,
    artistisPursuits: string,
    gaming: string,
    collectignHobby: string, 
    coffee: string,
    cookingSkills: string,
    spiritual: string,
    core: string,
    philosophy: string,
    socialCause: string,
    globalIssues: string,
    weirdBelief: string,
    currentOcupation: string,
    careerAspiation: string,
    education: string,
    skills: string,
    otherInterests: string,
    futureGoals: string,
    current: string,
    unusualExperinece: string,
    strangeHabits: string,
    socialMedia: any,
    user: string;
}

export type MedicalType = {
    _id: string;
    name: string,
    dateOfBirth: Date,
    gender: string,
    street: string,
    city: string,
    state: string,
    postalCode: number,
    phone: string,
    email: string,
    emergencyName: string,
    emergencyRelation: string,
    emergencyPhone: string,
    allergyHistory: string,
    chronicHistory: string,
    currentMedication: string,
    previousSurgeries: string,
    smoker: string,
    alcohol: string,
    exercise: string,
    diet: string,
    mentalCondition: string,
    vaccinationHistory: string,
    insuranceProvider: string,
    insurancePolicyNumber: number,
    insuranceGrpNumber: number,
    user: string;
}

export type Creator = {
    _id: string;
    name: string;
    links: any;
    user: string;
}