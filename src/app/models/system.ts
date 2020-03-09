export class System {
    constructor(
        public id: Number,
        public description: String,
        public initials: String,
        public email: String,
        public url: String,
        public status: Number,
        public userResponsibleForLastUpdate: String,
        public updateAt: Date,
        public justificationForTheLastUpdate: String,
        public newJustification: String,
    ) { }
}