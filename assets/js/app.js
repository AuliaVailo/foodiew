const index = new Vue({
    el: '#app',
    data: { 
        // url: 'https://tranquil-dawn-58446.herokuapp.com',
        url: 'http://localhost:8000',
        title: 'foodiew',
        isLogin: 0,
        email: '',
        password: '',
        confirm_password: '',
        items: [],
        emailError: '',
        passwordError: '',
        confirmPasswordError: '',
        isLoading: false,
        generalErrorMessage: '',
        profile: [],
        trending_caffe: [],
        trending_foods: [],
        trending_baverages: [],
        location: '',
    },
    created () {
        let token = localStorage.getItem('token')
        if (token !== null) {
            this.isLogin = 1
        }
        this.getCaffe()
        this.getFoods()
        this.getBeverages()
        this.location = 'Bandung'
    },
    methods: {
        register: function () {
            this.isLoading = true
            if (this.password !== this.confirm_password) {
                this.passwordError = 'Your password not match with Confirmation Password'
                this.confirmPasswordError = 'Your Confirmation Password not match with Password'
                setTimeout(() => {
                    this.passwordError = ''
                    this.confirmPasswordError = ''
                }, 3000);
                this.isLoading = false
                return
            }
            // this.isLogin = 1
            // $('#staticBackdrop').modal('hide')
            // $('#staticBackdrop2').modal('hide')
            let url = this.url + '/api/registration'
            // let token = localStorage.getItem('token')
            let header = {
                // headers: {
                //     'Authorization': `${token}`,
                // }
            }
            let payload = {
                email: this.email,
                password: this.password,
            }
            axios.post(url, payload, header)
                .then((res) => {
                    console.log(res)
                    this.isLoading = false
                    if (res.status === 200) {
                        this.generalErrorMessage = res.data.message
                        $('#generalModal').modal('show')
                        this.email = ''
                        this.password = ''
                        this.confirm_password = ''
                        setTimeout(() => {
                            $('#generalModal').modal('hide')
                            $('#staticBackdrop').modal('hide')
                            $('#staticBackdrop2').modal('hide')
                        }, 5000);
                    }
                })
                .catch((err) => {
                    this.isLoading = false
                    if (err.response !== undefined) {
                        this.generalErrorMessage = err.response.data
                    } else {
                        this.generalErrorMessage = err
                    }
                    $('#generalModal').modal('show')
                    setTimeout(() => {
                        $('#generalModal').modal('hide')
                    }, 3000);
                })
        },
        signin: function () {
            this.isLoading = true
            
            if (this.email === '') {
                this.email = 'Your password not match with Confirmation Password'
                setTimeout(() => {
                    this.email = ''
                }, 3000);
                this.isLoading = false
                return
            }

            if (this.password === '') {
                this.passwordError = 'Your password not match with Confirmation Password'
                setTimeout(() => {
                    this.passwordError = ''
                }, 3000);
                this.isLoading = false
                return
            }
            // this.isLogin = 1
            // $('#staticBackdrop').modal('hide')
            // $('#staticBackdrop2').modal('hide')
            let url = this.url + '/api/login'
            // let token = localStorage.getItem('token')
            let header = {
                // headers: {
                //     'Authorization': `${token}`,
                // }
            }
            let payload = {
                username: this.email,
                password: this.password,
            }
            axios.post(url, payload, header)
                .then((res) => {
                    console.log(res)
                    this.isLoading = false
                    if (res.status === 200) {
                        this.generalErrorMessage = "Sign-in Success..."
                        $('#generalModal').modal('show')
                        localStorage.setItem('token', res.data.token)
                        this.email = ''
                        this.password = ''
                        this.isLogin = 1
                        setTimeout(() => {
                            $('#generalModal').modal('hide')
                            $('#sign-in').modal('hide')
                            $('#sign-in2').modal('hide')
                        }, 1000);

                        // get profile user
                        this.getProfile()
                    }
                })
                .catch((err) => {
                    this.isLoading = false
                    if (err.response !== undefined) {
                        this.generalErrorMessage = err.response.data
                    } else {
                        this.generalErrorMessage = err
                    }
                    $('#generalModal').modal('show')
                    setTimeout(() => {
                        $('#generalModal').modal('hide')
                    }, 3000);
                })
        },
        signout: function () {
            localStorage.clear()
            this.isLogin = 0
        },
        getProfile: function () {
            let url = this.url + '/api/users'
            let token = 'Bearer ' + localStorage.getItem('token')
            let header = {
                headers: {
                    'Authorization': `${token}`,
                }
            }
            axios.get(url, header)
                .then((res) => {
                    this.profile = res.data.data[0]
                    localStorage.setItem('profile', JSON.stringify(this.profile))
                })
                .catch((err) => {
                    if (err.response !== undefined) {
                        this.generalErrorMessage = err.response.data
                    } else {
                        this.generalErrorMessage = err
                    }
                    $('#generalModal').modal('show')
                    setTimeout(() => {
                        $('#generalModal').modal('hide')
                    }, 3000);
                })
        },
        getCaffe: function () {
            let location = 'bandung'
            let url = this.url + '/api/caffes/' + location + '/location'
            // let token = 'Bearer' + localStorage.getItem('token')
            let header = {
                // headers: {
                //     'Authorization': `${token}`,
                // }
            }
            axios.get(url, header)
                .then((res) => {
                    this.trending_caffe = res.data.data
                    localStorage.setItem('trending_caffe', JSON.stringify(this.trending_caffe))
                })
                .catch((err) => {
                    if (err.response !== undefined) {
                        this.generalErrorMessage = err.response.data
                    } else {
                        this.generalErrorMessage = err
                    }
                    $('#generalModal').modal('show')
                    setTimeout(() => {
                        $('#generalModal').modal('hide')
                    }, 3000);
                })
        },
        getFoods: function () {
            let url = this.url + '/api/foods/1/type'
            // let token = 'Bearer' + localStorage.getItem('token')
            let header = {
                // headers: {
                //     'Authorization': `${token}`,
                // }
            }
            axios.get(url, header)
                .then((res) => {
                    this.trending_foods = res.data.data
                    localStorage.setItem('trending_foods', JSON.stringify(this.trending_foods))
                })
                .catch((err) => {
                    if (err.response !== undefined) {
                        this.generalErrorMessage = err.response.data
                    } else {
                        this.generalErrorMessage = err
                    }
                    $('#generalModal').modal('show')
                    setTimeout(() => {
                        $('#generalModal').modal('hide')
                    }, 3000);
                })
        },
        getBeverages: function () {
            let url = this.url + '/api/foods/2/type'
            // let token = 'Bearer' + localStorage.getItem('token')
            let header = {
                // headers: {
                //     'Authorization': `${token}`,
                // }
            }
            axios.get(url, header)
                .then((res) => {
                    this.trending_baverages = res.data.data
                    localStorage.setItem('trending_baverages', JSON.stringify(this.trending_baverages))
                })
                .catch((err) => {
                    if (err.response !== undefined) {
                        this.generalErrorMessage = err.response.data
                    } else {
                        this.generalErrorMessage = err
                    }
                    $('#generalModal').modal('show')
                    setTimeout(() => {
                        $('#generalModal').modal('hide')
                    }, 3000);
                })
        },
        
    }
})