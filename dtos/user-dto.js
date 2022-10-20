module.exports = class userDto {
    login;
    email;
    // id;

    constructor(model){
        this.login = model.login
        this.email = model.email
        // this.id = model.id
    }
}