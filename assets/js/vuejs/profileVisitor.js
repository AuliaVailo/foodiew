new Vue({
    el: '#app',
    data: { 
        url: 'http://localhost:8000',
        // url: 'https://tranquil-dawn-58446.herokuapp.com',
        urlStorage: 'https://images.traceofficial.com/',
        imageUrl: '',
        profileUrl: '',
        title: 'foodiew',
        isLogin: 0,
        items: [],
        isLoading: false,
        profile: [],
        userProfile: [],
        generalErrorMessage: '',
        cafeName: '',
        cafeAddress: '',
        locationLink: '',
        locationMap: '',
        cafenameError: '',
        cafeAddressError: '',
        locationErrorLink: '',
        locationErrorMap: '',
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
        detailDialog: [],
        promos: [],
        cafeRecomendation: [],
        nextCafeRecomendation: '',
        foodRecomendation: [],
        nextFoodRecomendation: '',
        beveragesRecomendation: [],
        nextBeveragesRecomendation: '',
        letReview: 1,
        search: '',
        email: '',
        password: '',
        confirm_password: '',
        passwordError: '',
        confirmPasswordError: ''
    },
    computed: {
        profileUser: function () {
            if (this.profile.length) {
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
        },
        thisUser: function () {
            // console.log('user profile', this.userProfile)
            let firstname = this.userProfile.members.first_name
            let midname = this.userProfile.members.mid_name
            let lastname = this.userProfile.members.last_name
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
                name = this.userProfile.email
            }
            this.userProfile.name = name
            return this.userProfile
        },
        searchReviewer: function () {
            if (this.profile.length) {
                return this.profileUser.voted_by.filter(item => {
                    if (!this.search) return this.profileUser.voted_by
                    return (
                        item.voter.user_name.toLowerCase().includes(this.search.toLowerCase()) || 
                        item.voter.email.toLowerCase().includes(this.search.toLowerCase()) || 
                        item.voter.members.first_name.toLowerCase().includes(this.search.toLowerCase()) || 
                        item.voter.members.mid_name.toLowerCase().includes(this.search.toLowerCase()) || 
                        item.voter.members.last_name.toLowerCase().includes(this.search.toLowerCase())
                        )
                })
            }
            return []
        }
    },
    created () {
        this.imageUrl = this.urlStorage + '/menus/'
        this.profileUrl = this.urlStorage + '/profiles/'
        let token = localStorage.getItem('token')
        if (token !== null) {
            this.isLogin = 1
            if (localStorage.getItem('profile')) {
                this.profile = JSON.parse(localStorage.getItem('profile'))
                this.username = this.profile.user_name
                this.email = this.profile.members.email
                this.firstName = this.profile.members.first_name
                this.midName = this.profile.members.last_name
                this.lastName = this.profile.members.mid_name
                this.placeOfBirth = this.profile.members.place_of_birth
                this.dateOfBirth = this.profile.members.date_of_birth
                this.gender = this.profile.members.gender
                this.address = this.profile.members.address
            } else {
                this.getProfile()
            }
            if (localStorage.getItem('profile-user')) {
                this.userProfile = JSON.parse(localStorage.getItem('profile-user'))
            } else {
                this.getProfileUser()
            }
        } else {
            // this.signout()
            if (localStorage.getItem('profile-user')) {
                this.userProfile = JSON.parse(localStorage.getItem('profile-user'))
                // console.log(this.userProfile)
            } else {
                // console.log('get profile user')
                this.getProfileUser()
            }
        }
        // console.log(this.userProfile)
        this.gotoRandomPromo()
        this.getRecomandationCafe()
        this.getRecomandationFood()
        this.getRecomandationBeverages()

    },
    methods: {
        signout: function () {
            localStorage.removeItem('token')
            localStorage.removeItem('userProfile')
            this.isLogin = 0
            window.location.replace('/')
        },
        registerCafe: function () {
            this.isLoading = true
            let url = this.url + '/api/caffes/register'
            let token = 'Bearer ' + localStorage.getItem('token')
            let header = {
                headers: {
                    'Authorization': `${token}`,
                }
            }
            let payload = {
                caffe_name: this.cafeName,
                caffe_address: this.cafeAddress,
                googlemaplink: this.locationLink,
                googlemaphtml: this.locationMap,
            }
            axios.post(url, payload, header)
                .then((res) => {
                    // console.log(res)
                    this.isLoading = false
                    if (res.status === 200) {
                        this.generalErrorMessage = res.data.message
                        $('#generalModal').modal('show')
                        this.cafeName = ''
                        this.cafeAddress = ''
                        this.locationLink = ''
                        this.locationMap = ''
                        this.getProfile()
                        setTimeout(() => {
                            $('#generalModal').modal('hide')
                            $('#registerCafe').modal('hide')
                            window.location.replace('/mycafe')
                        }, 5000);
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
        getProfile: function () {
            // console.log('get Profile Data')
            // let id = localStorage.getItem('route').split(':')[1]
            let url = this.url + '/api/users/'
            let token = 'Bearer ' + localStorage.getItem('token')
            let header = {
                headers: {
                    'Authorization': `${token}`,
                }
            }
            axios.get(url, header)
                .then((res) => {
                    this.profile = res.data.data
                    localStorage.setItem('profile', JSON.stringify(this.profile))
                    this.username = this.profile.user_name
                    this.email = this.profile.members.email
                    this.firstName = this.profile.members.first_name
                    this.midName = this.profile.members.last_name
                    this.lastName = this.profile.members.mid_name
                    this.placeOfBirth = this.profile.members.place_of_birth
                    this.dateOfBirth = this.profile.members.date_of_birth
                    this.gender = this.profile.members.gender
                    this.address = this.profile.members.address
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
        getProfileUser: function () {
            let id = localStorage.getItem('route').split(':')[1]
            let url = this.url + + '/api/users/' + id
            let token = 'Bearer ' + localStorage.getItem('token')
            let header = {
                headers: {
                    'Authorization': `${token}`,
                }
            }
            axios.get(url, header)
                .then((res) => {
                    this.userProfile = res.data.data
                    localStorage.setItem('profile-user', JSON.stringify(res.data.data))
                    localStorage.setItem('route', 'profile-user:' + id)
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
                        this.midName = this.profile.members.last_name
                        this.lastName = this.profile.members.mid_name
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
        toProfile: function () {
            if (this.isLogin) {
                window.location.replace('/profile')
            }

            this.generalErrorMessage = "You need to login, to acces your Profile"
            $('#generalModal').modal('show')
            setTimeout(() => {
                $('#generalModal').modal('hide')
            }, 3000);
        },
        setDetail: function(id, type) {
            // console.log(id, type)
            const that = this
            let array = []

            if (type === 1) {
                array = that.foodRecomendation
            }

            if (type === 2) {
                array = that.beveragesRecomendation
            }

            let result = array.filter(el => {
                return el.rating_menu.id === id
            })

            if (result.length > 0) {
                this.detailDialog = result[0]
                // console.log('detail dialog : ', this.detailDialog, this.profile)
                if (localStorage.getItem('token') && this.isLogin) {
                    if (this.detailDialog.user_id === this.profile.id) {
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
            }
            // console.log(this.detailDialog)
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
                    bedges.start = start
                    bedges.end = end
                    bedges.percentage = Number(totalVoting) / Number(end) * 100
                    bedges.nextLevel = bedgeReff[i + 1]
                    return bedges
                } else if (data.id === maxLengtReff) {
                    let end = data.max_vote
                    bedges = (totalVoting >= end) ? data : []
                    bedges.end = end
                    bedges.percentage = 100
                    bedges.nextLevel = end
                    return bedges
                } else {
                    let start = bedgeReff[i -1].max_vote
                    let end = data.max_vote
                    bedges = (totalVoting >= start && totalVoting <= end) ? data : []
                    bedges.start = start
                    bedges.end = end
                    bedges.percentage = Number(totalVoting) / Number(end) * 100
                    bedges.nextLevel = bedgeReff[i + 1]
                    return bedges
                }
            }
        },
        getRecomandationCafe: function() {
            let id = localStorage.getItem('route').split(':')[1]
            let url = this.url + '/api/caffes/recomendation/now/' + id
            // let token = 'Bearer ' + localStorage.getItem('token')
            let header = {
                // headers: {
                //     'Authorization': `${token}`,
                // }
            }
            axios.get(url, header)
                .then((res) => {
                    // console.log(res)
                    this.cafeRecomendation = res.data.data.data
                    this.nextCafeRecomendation = res.data.data.next_page_url
                    // console.log(this.cafeRecomendation, this.nextCafeRecomendation)
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
                            return
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
        getRecomandationFood: function() {
            let id = localStorage.getItem('route').split(':')[1]
            let url = this.url + '/api/foods/recomendation/1/now/' + id
            // let token = 'Bearer ' + localStorage.getItem('token')
            let header = {
                // headers: {
                //     'Authorization': `${token}`,
                // }
            }
            axios.get(url, header)
                .then((res) => {
                    // console.log('FOODS', res)
                    this.foodRecomendation = res.data.data.data
                    this.nextFoodRecomendation = res.data.data.next_page_url
                    // console.log('FOODS', this.foodRecomendation, this.nextFoodRecomendation)
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
                            return
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
        getRecomandationBeverages: function() {
            let id = localStorage.getItem('route').split(':')[1]
            let url = this.url + '/api/foods/recomendation/2/now/' + id
            // let token = 'Bearer ' + localStorage.getItem('token')
            let header = {
                // headers: {
                //     'Authorization': `${token}`,
                // }
            }
            axios.get(url, header)
                .then((res) => {
                    // console.log(res)
                    this.beveragesRecomendation = res.data.data.data
                    this.nextBeveragesRecomendation = res.data.data.next_page_url
                    // console.log(this.beveragesRecomendation, this.nextBeveragesRecomendation)
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
                            return
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
                    bedges.start = start
                    bedges.end = end
                    bedges.percentage = Number(totalVoting) / Number(end) * 100
                    bedges.nextLevel = bedgeReff[i + 1]
                    return bedges
                } else if (data.id === maxLengtReff) {
                    let end = data.max_vote
                    bedges = (totalVoting >= end) ? data : []
                    bedges.end = end
                    bedges.percentage = 100
                    bedges.nextLevel = end
                    return bedges
                } else {
                    let start = bedgeReff[i -1].max_vote
                    let end = data.max_vote
                    bedges = (totalVoting >= start && totalVoting <= end) ? data : []
                    bedges.start = start
                    bedges.end = end
                    bedges.percentage = Number(totalVoting) / Number(end) * 100
                    bedges.nextLevel = bedgeReff[i + 1]
                    return bedges
                }
            }
        },
        nextRecomendation: function (type) {
            let url
            if (type === 0) {
                url = this.nextCafeRecomendation
            }

            if (type === 1) {
                url = this.nextFoodRecomendation
            }

            if (type === 2) {
                url = this.nextBeveragesRecomendation
            }
            let token = 'Bearer' + localStorage.getItem('token')
            let header = {
                headers: {
                    'Authorization': `${token}`,
                }
            }
            // console.log(url, header)
            axios.get(url, header)
                .then((res) => {
                    let data = res.data.data.data
                    // console.log(res, data)
                    if (type === 0) {
                        data.map(el => {this.cafeRecomendation.push(el)})
                        this.nextCafeRecomendation = res.data.data.next_page_url
                    }

                    if (type === 1) {
                        data.map(el => {this.foodRecomendation.push(el)})
                        this.nextFoodRecomendation = res.data.data.next_page_url
                    }

                    if (type === 2) {
                        data.map(el => {this.beveragesRecomendation.push(el)})
                        this.nextBeveragesRecomendation = res.data.data.next_page_url
                    }
                })
                .catch((err) => {
                    console.error(err)
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
            // console.log(id)
            if (id == this.profile.id) {
                window.location.replace('/profile')
            } else {
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
            }
        },
        voteMobile: function () {
            if (this.isLogin) {
                if (this.thisUser.id === this.profileUser.id) {
                    this.generalErrorMessage = "You can't vote your self."
                    $('#generalModal').modal('show')
                    setTimeout(() => {
                        $('#generalModal').modal('hide')
                    }, 1000);
                } else {
                    this.vote()
                }
            } else {
                this.generalErrorMessage = "You need to login, to acces your Profile"
                $('#generalModal').modal('show')
                setTimeout(() => {
                    $('#generalModal').modal('hide')
                    $('#sign-in2').modal('show')
                }, 1000);
            }
        },
        voteDesktop: function () {
            if (this.isLogin) {
                if (this.thisUser.id === this.profileUser.id) {
                    this.generalErrorMessage = "You can't vote your self."
                    $('#generalModal').modal('show')
                    setTimeout(() => {
                        $('#generalModal').modal('hide')
                    }, 1000);
                } else {
                    this.vote()
                }
            } else {
                this.generalErrorMessage = "You need to login, to acces your Profile"
                $('#generalModal').modal('show')
                setTimeout(() => {
                    $('#generalModal').modal('hide')
                    $('#sign-in').modal('show')
                }, 1000);
            }
        },
        vote: function () {
            this.isLoading = true
            let url = this.url + '/api/vote'
            let token = 'Bearer ' + localStorage.getItem('token')
            let header = {
                headers: {
                    'Authorization': `${token}`,
                }
            }
            let payload = {
                user_id: this.thisUser.id
            }
            axios.post(url, payload, header)
                .then((res) => {
                    this.isLoading = false
                    if (res.status === 200) {
                        if (res.data.message === 'vote') {
                            // add vote data to voted_by
                            this.userProfile.voted_by.push(res.data.data[0])
                            localStorage.setItem('profile-user', JSON.stringify(this.userProfile))
                        }
                        if (res.data.message === 'unvote') {
                            // remove vote data on voted_by
                            let sisa = this.userProfile.voted_by.filter(el => {
                                return el.voter_id !== this.profile.id
                            })

                            this.userProfile.voted_by = sisa
                            localStorage.setItem('profile-user', JSON.stringify(this.userProfile))
                        }
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
        isVote: function (votedBy) {
            if (this.isLogin) {
                if (votedBy.length <= 0) {
                    return false
                }
                let vote = votedBy.filter(el => {
                    return el.voter_id = this.profileUser.id
                })
                if (vote.length > 0) {
                    return true
                } else {
                    return false
                }
            } else {
                return false
            }
        },
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
                            window.location.reload()
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
                        window.location.reload()
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
        countRating: function(reviews) {
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
    }
})

$('[data-toggle="tooltip"]').tooltip()
bsCustomFileInput.init()