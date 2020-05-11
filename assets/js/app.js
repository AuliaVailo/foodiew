new Vue({
    el: '#app',
    data: { 
        // url: 'http://localhost:8000',
        url: 'https://tranpmnquil-dawn-58446.herokuapp.com',
        urlStorage: 'https://images.traceofficial.com/',
        imageUrl: '',
        profileUrl: '',
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
        detailDialog: [],
        nextBeverages: null,
        nextFoods: null,
        letReview: 1,
        rating: 1,
        review: '',
        rate: 0,
        selectedReview: [],
        usernameError: '',
        firstNameError: '',
        midNameError: '',
        latNameError: '',
        placeOfBirthError: '',
        dateOfBirthError: '',
        genderError: '',
        addressError: '',
        emailError: '',
        username: '',
        email: '',
        firstName: '',
        midName: '',
        lastName: '',
        placeOfBirth: '',
        dateOfBirth: '',
        gender: '',
        address: '',
        nextCafe: '',
        erroMessage: '',
        promos: [],
        badgeReff: []
    },
    computed: {
        profileUser: function () {
            if (this.profile.members) {
                // console.log(this.profile)
                let firstname = this.profile.members.first_name
                let midname = this.profile.members.mid_name
                let lastname = this.profile.members.last_name
                if (firstname === null) {
                    firstname = ''
                }
                if (midname === null) {
                    midname = ''
                }
                if (lastname === null) {
                    lastname = ''
                }
                let name = firstname + ' ' + midname + ' ' + lastname
                name = name.trim()
                if (name === '') {
                    name = this.profile.email
                }
                this.profile.name = name
            }
            return this.profile
        }
    },
    created () {
        this.imageUrl = this.urlStorage + '/menus/'
        this.profileUrl = this.urlStorage + '/profiles/'
        let token = localStorage.getItem('token')
        if (token !== null) {
            this.isLogin = 1
            if(localStorage.getItem('profile')) {
                this.profile = JSON.parse(localStorage.getItem('profile'))
                this.username = this.profile.user_name
                this.email = this.profile.members.email
                this.firstName = this.profile.members.first_name
                this.midName = this.profile.members.mid_name
                this.lastName = this.profile.members.last_name
                this.placeOfBirth = this.profile.members.place_of_birth
                this.dateOfBirth = this.profile.members.date_of_birth
                this.gender = this.profile.members.gender
                this.address = this.profile.members.address
            } else {
                this.getProfile()
            }
        }
        this.getLocationIp()
        this.getCaffe()
        this.getFoods()
        this.getBeverages()
        this.gotoRandomPromo()
        this.getBadgeReff()
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
                    // console.log(res)
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
                    // console.log(res)
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
            window.location.replace('/')
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
                    // console.log(res)
                    this.profile = res.data.data
                    localStorage.setItem('profile', JSON.stringify(this.profile))
                    window.location.replace('/')
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
                    this.nextCafe = res.data.data.next_page_url
                    this.trending_caffe = res.data.data
                    localStorage.setItem('trending_caffe', JSON.stringify(this.trending_caffe))
                })
                .catch((err) => {
                    console.error(err)
                    // if (err.response !== undefined) {
                    //     this.generalErrorMessage = err.response.data
                    // } else {
                    //     this.generalErrorMessage = err
                    // }
                    // $('#generalModal').modal('show')
                    // setTimeout(() => {
                    //     $('#generalModal').modal('hide')
                    // }, 3000);
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
                    this.nextFoods = res.data.data.next_page_url
                    this.trending_foods = res.data.data
                    localStorage.setItem('trending_foods', JSON.stringify(this.trending_foods))
                })
                .catch((err) => {
                    console.error(err)
                    // if (err.response !== undefined) {
                    //     this.generalErrorMessage = err.response.data
                    // } else {
                    //     this.generalErrorMessage = err
                    // }
                    // $('#generalModal').modal('show')
                    // setTimeout(() => {
                    //     $('#generalModal').modal('hide')
                    // }, 3000);
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
                    this.nextBeverages = res.data.data.next_page_url
                    this.trending_baverages = res.data.data
                    localStorage.setItem('trending_baverages', JSON.stringify(this.trending_baverages))
                })
                .catch((err) => {
                    console.error(err)
                    // if (err.response !== undefined) {
                    //     this.generalErrorMessage = err.response.data
                    // } else {
                    //     this.generalErrorMessage = err
                    // }
                    // $('#generalModal').modal('show')
                    // setTimeout(() => {
                    //     $('#generalModal').modal('hide')
                    // }, 3000);
                })
        },
        getLocationIp: function () {
            let url = 'https://ipapi.co/json'
            axios.get(url)
                .then((res) => {
                    this.location = res.data
                    this.location.countryCode = res.data.country_code
                    localStorage.setItem('myLocation', JSON.stringify(res.data))
                })
                .catch((err) => {
                    console.error(err)
                })
        },
        toProfile: function () {
            if (this.isLogin) {
                window.location.replace('/profile')
                return
            }

            this.generalErrorMessage = "You need to login, to acces your Profile"
            $('#generalModal').modal('show')
            setTimeout(() => {
                $('#generalModal').modal('hide')
                $('#sign-in2').modal('show')
            }, 1000);
        },
        setDetail: function(id, type) {
            const that = this
            let array = []

            if (type === 1) {
                array = that.trending_foods.data
            }

            if (type === 2) {
                array = that.trending_baverages.data
            }

            let result = array.filter(el => {
                return el.id === id
            })

            if (result.length > 0) {
                this.detailDialog = result[0]
                if (localStorage.getItem('token') && this.isLogin) {
                    if (this.detailDialog.caffes.user_id === this.profile.id) {
                        this.letReview = 0
                        this.detailDialog.letReview = 0
                    } else {
                        this.letReview = 1
                        this.detailDialog.letReview = 1
                    }
                } else {
                    this.letReview = 0
                    this.detailDialog.letReview = 0
                }
                // console.log(this.detailDialog, this.detailDialog.caffes.user_id, this.profile.id, this.letReview)
            }
        },
        searchCategory: function(id) {
            let Category = [
                {id: 1, name: 'ICE'},
                {id: 2, name: 'HOT'},
                {id: 3, name: 'NOODLE'},
                {id: 4, name: 'RICE'}
            ]
            let result = Category.filter(el => {
                return el.id === Number(id)
            })
            
            if(result.length > 0){
                result = result[0]
                return result.name
            }
        },
        seeMoreFood: function (type) {
            let url
            if (type === 0) {
                url = this.nextCafe
            }

            if (type === 1) {
                url = this.nextFoods
            }

            if (type === 2) {
                url = this.nextBeverages
            }
            // let token = 'Bearer' + localStorage.getItem('token')
            let header = {
                // headers: {
                //     'Authorization': `${token}`,
                // }
            }
            axios.get(url, header)
                .then((res) => {
                    let data = res.data.data.data
                    if (type === 0) {
                        data.map(el => {this.trending_caffe.data.push(el)})
                        this.nextFoods = res.data.data.next_page_url
                        localStorage.setItem('trending_caffe', JSON.stringify(this.trending_caffe))
                    }

                    if (type === 1) {
                        data.map(el => {this.trending_foods.data.push(el)})
                        this.nextFoods = res.data.data.next_page_url
                        localStorage.setItem('trending_foods', JSON.stringify(this.trending_foods))
                    }

                    if (type === 2) {
                        data.map(el => {this.trending_baverages.data.push(el)})
                        this.nextBeverages = res.data.data.next_page_url
                        localStorage.setItem('trending_beverages', JSON.stringify(this.trending_baverages))
                    }
                })
                .catch((err) => {
                    console.error(err)
                    // if (err.response !== undefined) {
                    //     this.generalErrorMessage = err.response.data
                    // } else {
                    //     this.generalErrorMessage = err
                    // }
                    // $('#generalModal').modal('show')
                    // setTimeout(() => {
                    //     $('#generalModal').modal('hide')
                    // }, 3000);
                })
        },
        addReview: function () {
            this.isLoading = true
            let url = this.url + '/api/foods/reviews'
            let token = 'Bearer ' + localStorage.getItem('token')
            let header = {
                headers: {
                    'Authorization': `${token}`,
                }
            }
            let payload = {
                id: this.detailDialog.id,
                rate: this.rate,
                review: this.review,
            }
            axios.post(url, payload, header)
                .then((res) => {
                    // console.log(res)
                    this.isLoading = false
                    if (res.status === 200) {
                        this.generalErrorMessage = res.data.message
                        $('#generalModal').modal('show')
                        // add review to state
                        // this.detailDialog.reviews.push(res.data.data)
                        if (this.detailDialog.type === '1') { // food
                            let objIndex = this.trending_foods.data.findIndex((obj => obj.id === this.detailDialog.id))
                            this.trending_foods.data[objIndex].reviews.push(res.data.data)
                        }

                        if (this.detailDialog.type === '2') { // food
                            let objIndex = this.trending_baverages.data.findIndex((obj => obj.id === this.detailDialog.id))
                            this.trending_baverages.data[objIndex].reviews.push(res.data.data)
                        }
                        setTimeout(() => {
                            $('#generalModal').modal('hide')
                            $('#writeReview').modal('hide')
                            this.rate = 0
                            this.review = ''
                        }, 1000);
                    }
                })
                .catch((err) => {
                    this.isLoading = false
                    const that = this
                    if (err.response !== undefined) {
                        if(err.response.status === 401){
                            this.generalErrorMessage = 'Your session is expired, please login...'
                            $('#generalModal').modal('show')
                            setTimeout(() => {
                                $('#generalModal').modal('hide')
                                $('#writeReview').modal('hide')
                                that.signout()
                            }, 3000);
                        } else if (err.response.status === 500){
                            this.generalErrorMessage = err.response.data.message
                            $('#generalModal').modal('show')
                            setTimeout(() => {
                                $('#generalModal').modal('hide')
                                $('#writeReview').modal('hide')
                            }, 3000);
                        } else {
                            this.generalErrorMessage = err.response.statusText
                        }
                    } else {
                        this.generalErrorMessage = err
                    }
                    $('#generalModal').modal('show')
                    setTimeout(() => {
                        $('#generalModal').modal('hide')
                    }, 3000);
                })
        },
        confirmDeleteReveiw: function(reviewId, type, menuId) {
            // console.log(reviewId, type, menuId)
            this.reviewId = reviewId
            this.type = type
            this.menuId = menuId
            $('#deleteReview').modal('show')
        },
        doDelete: function() {
            $('#deleteReview').modal('hide')
            this.isLoading = true
            let url = this.url + '/api/foods/reviews/' + this.reviewId
            let token = 'Bearer ' + localStorage.getItem('token')
            let header = {
                headers: {
                    'Authorization': `${token}`,
                }
            }
            let payload = {
                // username: this.email,
                // password: this.password,
            }
            axios.delete(url, header, payload )
                .then((res) => {
                    // console.log(res)
                    this.isLoading = false
                    if (res.status === 200) {
                        this.generalErrorMessage = "Delete Success..."
                        $('#generalModal').modal('show')
                        // delete data from state
                        this.detailDialog.reviews = this.detailDialog.reviews.filter(el => {
                            return el.id !== this.reviewId
                        })
                        if (this.type === '1') {
                            let objIndex = this.trending_foods.data.findIndex((obj => obj.id === this.menuId))
                            let review = this.trending_foods.data[objIndex].reviews.filter(el => {
                                return el.id !== this.reviewId
                            })
                            this.trending_foods.data[objIndex].reviews = review
                        } // food

                        if (this.type === '2') {
                            let objIndex = this.trending_baverages.data.findIndex((obj => obj.id === this.menuId))
                            let review = this.trending_baverages.data[objIndex].reviews.filter(el => {
                                return el.id !== this.reviewId
                            })
                            this.trending_baverages.data[objIndex].reviews = review
                        } // beverages
                        setTimeout(() => {
                            $('#generalModal').modal('hide')
                            $('#deleteReview').modal('hide')
                            
                            this.reviewId = ''
                            this.type = ''
                            this.menuId = ''
                        }, 1000);
                    }
                })
                .catch((err) => {
                    this.isLoading = false
                    const that = this
                    if (err.response !== undefined) {
                        if(err.response.status === 401){
                            this.generalErrorMessage = 'Your session is expired, please login...'
                            $('#generalModal').modal('show')
                            setTimeout(() => {
                                $('#generalModal').modal('hide')
                                // that.signout()
                            }, 3000);
                        } else {
                            this.generalErrorMessage = err.response.statusText
                        }
                    } else {
                        this.generalErrorMessage = err
                    }
                    $('#generalModal').modal('show')
                    setTimeout(() => {
                        $('#generalModal').modal('hide')
                    }, 3000);
                })
        },
        openThisCafe: function(id) {
            let url = this.url + '/api/caffes/' + id
            let token = 'Bearer ' + localStorage.getItem('token')
            let header = {
                headers: {
                    'Authorization': `${token}`,
                }
            }
            axios.get(url, header)
                .then((res) => {
                    // console.log(res)
                    localStorage.setItem('profile-cafe', JSON.stringify(res.data.data))
                    localStorage.setItem('route', 'profile-cafe:' + id)
                    window.location.replace('/profile-cafe')
                })
                .catch((err) => {
                    this.isLoading = false
                    const that = this
                    if (err.response !== undefined) {
                        if(err.response.status === 401){
                            this.generalErrorMessage = 'Your session is expired, please login...'
                            $('#generalModal').modal('show')
                            setTimeout(() => {
                                $('#generalModal').modal('hide')
                                that.signout()
                            }, 3000);
                        } else {
                            this.generalErrorMessage = err.response.statusText
                        }
                    } else {
                        this.generalErrorMessage = err
                    }
                    $('#generalModal').modal('show')
                    setTimeout(() => {
                        $('#generalModal').modal('hide')
                    }, 3000);
                })
        },
        openThisProfile: function(id) {
            let url = this.url + '/api/users/' + id
            let token = 'Bearer ' + localStorage.getItem('token')
            let header = {
                headers: {
                    'Authorization': `${token}`,
                }
            }
            axios.get(url, header)
                .then((res) => {
                    // console.log(res)
                    localStorage.setItem('profile-user', JSON.stringify(res.data.data))
                    localStorage.setItem('route', 'profile-user:' + id)
                    window.location.replace('/profile-user')
                })
                .catch((err) => {
                    this.isLoading = false
                    const that = this
                    if (err.response !== undefined) {
                        if(err.response.status === 401){
                            this.generalErrorMessage = 'Your session is expired, please login...'
                            $('#generalModal').modal('show')
                            setTimeout(() => {
                                $('#generalModal').modal('hide')
                                that.signout()
                            }, 3000);
                        } else {
                            this.generalErrorMessage = err.response.statusText
                        }
                    } else {
                        this.generalErrorMessage = err
                    }
                    $('#generalModal').modal('show')
                    setTimeout(() => {
                        $('#generalModal').modal('hide')
                    }, 3000);
                })
        },
        gotoRandomPromo: function() {
            let url = this.url + '/api/sponsore'
            axios.get(url)
                .then((res) => {
                    this.promos = res.data.data
                    // console.log(this.promos)
                })
                .catch((err) => {
                    this.isLoading = false
                    const that = this
                    if (err.response !== undefined) {
                        if(err.response.status === 401){
                            this.generalErrorMessage = 'Your session is expired, please login...'
                            $('#generalModal').modal('show')
                            setTimeout(() => {
                                $('#generalModal').modal('hide')
                                that.signout()
                            }, 3000);
                        } else {
                            this.generalErrorMessage = err.response.statusText
                        }
                    } else {
                        this.generalErrorMessage = err
                    }
                    $('#generalModal').modal('show')
                    setTimeout(() => {
                        $('#generalModal').modal('hide')
                    }, 3000);
                })
        },
        gotoRandomCafe: function() {
            let url = this.url + '/api/caffes/random/cafes'
            // let token = 'Bearer ' + localStorage.getItem('token')
            let header = {
                // headers: {
                //     'Authorization': `${token}`,
                // }
            }
            axios.get(url, header)
                .then((res) => {
                    this.openThisCafe(res.data.data.id)
                })
                .catch((err) => {
                    this.isLoading = false
                    const that = this
                    if (err.response !== undefined) {
                        if(err.response.status === 401){
                            this.generalErrorMessage = 'Your session is expired, please login...'
                            $('#generalModal').modal('show')
                            setTimeout(() => {
                                $('#generalModal').modal('hide')
                                that.signout()
                            }, 3000);
                        } else {
                            this.generalErrorMessage = err.response.statusText
                        }
                    } else {
                        this.generalErrorMessage = err
                    }
                    $('#generalModal').modal('show')
                    setTimeout(() => {
                        $('#generalModal').modal('hide')
                    }, 3000);
                })
        },
        changeProfile: function (e) {
            const { maxSize } = this
            let imageFile = e.target.files[0]
            // console.log(imageFile)
            let formData = new FormData()
            let size = imageFile.size / maxSize / maxSize
            if (!imageFile.type.match('image.*')) {
                // check whether the upload is an image
                this.generalErrorMessage = 'Please choose an image file'
                this.erroMessage = this.generalErrorMessage
                $('#generalModal').modal('show')
                return
            } else if (size>1) {
                // check whether the size is greater than the size limit
                this.generalErrorMessage = 'Your file is too big! Please select an image under 1MB'
                this.erroMessage = this.generalErrorMessage
                $('#generalModal').modal('show')
                return
            } else {
                // Append file into FormData and turn file into image URL
                formData.append('pictures[0]', imageFile);
            }

            this.isLoading = true
            let url = this.url + '/api/users/changeProfile'
            let token = 'Bearer ' + localStorage.getItem('token')
            let header = {
                headers: {
                    'Authorization': `${token}`,
                    'Content-type': `multipart/form-data`
                }
            }

            let payload = formData
            // console.log('payload', payload)
            axios.post(url, payload, header)
                .then((res) => {
                    // console.log(res)
                    this.isLoading = false
                    if (res.status === 200) {
                        this.generalErrorMessage = res.data.message
                        $('#generalModal').modal('show')
                        this.profile.members.profile_pictures = res.data.data.profile_pictures
                        localStorage.setItem('profile', JSON.stringify(this.profile))
                        setTimeout(() => {
                            $('#generalModal').modal('hide')
                        }, 500);
                    }
                })
                .catch((err) => {
                    this.isLoading = false
                    const that = this
                    if (err.response !== undefined) {
                        if(err.response.status === 401){
                            this.generalErrorMessage = 'Your session is expired, please login...'
                            $('#generalModal').modal('show')
                            setTimeout(() => {
                                $('#generalModal').modal('hide')
                                that.signout()
                            }, 3000);
                        } else {
                            this.generalErrorMessage = err.response.statusText
                        }
                    } else {
                        this.generalErrorMessage = err
                    }
                    $('#generalModal').modal('show')
                    setTimeout(() => {
                        $('#generalModal').modal('hide')
                    }, 3000);
                })
        },
        updateProfile: function () {
            this.isLoading = true
            let url = this.url + '/api/users/'
            let token = 'Bearer ' + localStorage.getItem('token')
            let header = {
                headers: {
                    'Authorization': `${token}`
                }
            }

            let payload = {
                user_name: this.username,
                email: this.email,
                first_name: this.firstName,
                mid_name: this.midName,
                last_name: this.lastName,
                place_of_birth: this.placeOfBirth,
                date_of_birth: this.dateOfBirth,
                gender: this.gender,
                address: this.address
            }
            
            axios.put(url, payload, header)
                .then((res) => {
                    // console.log(res)
                    this.isLoading = false
                    if (res.status === 200) {
                        this.generalErrorMessage = res.data.message
                        $('#generalModal').modal('show')
                        this.profile.user_name = res.data.data.user_name
                        this.profile.members.user_name = res.data.data.user_name
                        this.profile.members.email = res.data.data.email
                        this.profile.members.first_name = res.data.data.first_name
                        this.profile.members.mid_name = res.data.data.mid_name
                        this.profile.members.last_name = res.data.data.last_name
                        this.profile.members.place_of_birth = res.data.data.place_of_birth
                        this.profile.members.date_of_birth = res.data.data.date_of_birth
                        this.profile.members.gender = res.data.data.gender
                        this.profile.members.address = res.data.data.address
                        
                        localStorage.setItem('profile', JSON.stringify(this.profile))

                        this.username = this.profile.user_name
                        this.email = this.profile.members.email
                        this.firstName = this.profile.members.first_name
                        this.midName = this.profile.members.mid_name
                        this.lastName = this.profile.members.last_name
                        this.placeOfBirth = this.profile.members.place_of_birth
                        this.dateOfBirth = this.profile.members.date_of_birth
                        this.gender = this.profile.members.gender
                        this.address = this.profile.members.address
                        setTimeout(() => {
                            $('#generalModal').modal('hide')
                            $('#settingModal').modal('hide')
                        }, 500);
                    }
                })
                .catch((err) => {
                    this.isLoading = false
                    const that = this
                    if (err.response !== undefined) {
                        if(err.response.status === 401){
                            this.generalErrorMessage = 'Your session is expired, please login...'
                            $('#generalModal').modal('show')
                            setTimeout(() => {
                                $('#generalModal').modal('hide')
                                that.signout()
                            }, 3000);
                        } else {
                            this.generalErrorMessage = err.response.statusText
                        }
                    } else {
                        this.generalErrorMessage = err
                    }
                    $('#generalModal').modal('show')
                    setTimeout(() => {
                        $('#generalModal').modal('hide')
                    }, 3000);
                })
        },
        countRate: function(reviews) {
            let rate = 0
            let totalRating = 0
            let totalData = 1
            if(reviews.length) {
                reviews.map(el=>{
                    totalRating += el.rating
                    totalData++
                })
                rate = totalRating / totalData
            } else {
                rate = 1
            }
            return Number(Math.round(rate))
        },
        forgotPassword: function() {
            this.isLoading = true
            let url = this.url + '/api/forgot'
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
                    // console.log(res)
                    this.isLoading = false
                    if (res.status === 200) {
                        this.generalErrorMessage = res.data.message
                        $('#generalModal').modal('show')
                        this.email = ''
                        setTimeout(() => {
                            $('#generalModal').modal('hide')
                            $('#forgotPassword').modal('hide')
                            $('#forgotPassword2').modal('hide')
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
        openDetailSponsore: function(item) {
            this.detailDialog = item
            if (this.detailDialog.caffes.user_id === this.profile.id) {
                this.letReview = 0
                this.detailDialog.letReview = 0
            } else {
                this.letReview = 1
                this.detailDialog.letReview = 1
            }
            $('#detailSponsore').modal('show')
        },
        getBadgeReff: function() {
            let url = this.url + '/api/badge'
            // let token = 'Bearer' + localStorage.getItem('token')
            let header = {
                // headers: {
                //     'Authorization': `${token}`,
                // }
            }
            axios.get(url, header)
            .then((res) => {
                if(res.status === 200) {
                    this.badgeReff = res.data.data
                    localStorage.setItem('bedgeReff', JSON.stringify(this.badgeReff))
                }
            })
            .catch((err) => {
                console.log(err)
            })
        },
        defineBedge: function() {
            let bedgeReff = JSON.parse(localStorage.getItem('bedgeReff'))
            let totalVoting = this.profileUser.voted_by.length
            let maxLengtReff = bedgeReff.length
            for (let i = 0; i < maxLengtReff; i++) {
                let data = bedgeReff[i]
                let bedges = []
                if (data.id === 1) {
                    let start = 0
                    let end = data.max_vote
                    bedges = (totalVoting >= start && totalVoting <= end) ? data : []
                    // console.log(start, end, bedges)
                    return bedges
                } else if (data.id === maxLengtReff) {
                    let end = data.max_vote
                    bedges = (totalVoting >= end) ? data : []
                    // console.log(end, bedges)
                    return bedges
                } else {
                    let start = bedgeReff[i -1].max_vote
                    let end = data.max_vote
                    bedges = (totalVoting >= start && totalVoting <= end) ? data : []
                    // console.log(start, end, bedges)
                    return bedges
                }
            }
        },
        defineBedgeReviewer: function(voted_by) {
            let bedgeReff = JSON.parse(localStorage.getItem('bedgeReff'))
            let totalVoting = voted_by.length
            let maxLengtReff = bedgeReff.length
            for (let i = 0; i < maxLengtReff; i++) {
                let data = bedgeReff[i]
                let bedges = []
                if (data.id === 1) {
                    let start = 0
                    let end = data.max_vote
                    bedges = (totalVoting >= start && totalVoting <= end) ? data : []
                    // console.log(start, end, bedges)
                    return bedges
                } else if (data.id === maxLengtReff) {
                    let end = data.max_vote
                    bedges = (totalVoting >= end) ? data : []
                    // console.log(end, bedges)
                    return bedges
                } else {
                    let start = bedgeReff[i -1].max_vote
                    let end = data.max_vote
                    bedges = (totalVoting >= start && totalVoting <= end) ? data : []
                    // console.log(start, end, bedges)
                    return bedges
                }
            }
        }
    }
})