new Vue({
    el: '#app',
    data: { 
        url: 'http://localhost:8000',
        // url: 'https://tranquil-dawn-58446.herokuapp.com',
        imageUrl: 'http://localhost:8000/menus/',
        // imageUrl: 'https://tranquil-dawn-58446.herokuapp.com/menus/',
        profileUrl: 'http://localhost:8000/profiles/',
        // profileUrl: 'https://tranquil-dawn-58446.herokuapp.com/profiles/',
        title: 'foodiew',
        isLogin: 0,
        items: [],
        isLoading: false,
        profile: [],
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
        search: ''
    },
    computed: {
        profileUser: function () {
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
            return this.profile
        },
        searchReviewer: function () {
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
    },
    created () {
        let token = localStorage.getItem('token')
        if (token !== null) {
            this.isLogin = 1
            if (localStorage.getItem('profile')) {
                this.profile = JSON.parse(localStorage.getItem('profile'))
            } else {
                this.getProfile()
            }
        } else {
            this.signout()
        }
        this.gotoRandomPromo()
        this.getRecomandationCafe()
        this.getRecomandationFood()
        this.getRecomandationBeverages()
        this.username = this.profile.user_name
        this.email = this.profile.members.email
        this.firstName = this.profile.members.first_name
        this.midName = this.profile.members.last_name
        this.lastName = this.profile.members.mid_name
        this.placeOfBirth = this.profile.members.place_of_birth
        this.dateOfBirth = this.profile.members.date_of_birth
        this.gender = this.profile.members.gender
        this.address = this.profile.members.address

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
                    console.log(res)
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
            let url = this.url + '/api/users'
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
        changeProfile: function (e) {
            const { maxSize } = this
            let imageFile = e.target.files[0]
            console.log(imageFile)
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
            console.log('payload', payload)
            axios.post(url, payload, header)
                .then((res) => {
                    console.log(res)
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
                    console.log(res)
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
            console.log(id, type)
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
                console.log('detail dialog : ', this.detailDialog, this.profile)
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
            console.log(this.detailDialog)
        },
        gotoRandomPromo: function() {
            let url = this.url + '/api/sponsore'
            axios.get(url)
                .then((res) => {
                    this.promos = res.data.data
                    console.log(this.promos)
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
                    console.log(res)
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
            let url = this.url + '/api/caffes/recomendation/now'
            let token = 'Bearer ' + localStorage.getItem('token')
            let header = {
                headers: {
                    'Authorization': `${token}`,
                }
            }
            axios.get(url, header)
                .then((res) => {
                    console.log(res)
                    this.cafeRecomendation = res.data.data.data
                    this.nextCafeRecomendation = res.data.data.next_page_url
                    console.log(this.cafeRecomendation, this.nextCafeRecomendation)
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
        getRecomandationFood: function() {
            let url = this.url + '/api/foods/recomendation/1/now'
            let token = 'Bearer ' + localStorage.getItem('token')
            let header = {
                headers: {
                    'Authorization': `${token}`,
                }
            }
            axios.get(url, header)
                .then((res) => {
                    console.log(res)
                    this.foodRecomendation = res.data.data.data
                    this.nextFoodRecomendation = res.data.data.next_page_url
                    console.log(this.foodRecomendation, this.nextFoodRecomendation)
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
        getRecomandationBeverages: function() {
            let url = this.url + '/api/foods/recomendation/2/now'
            let token = 'Bearer ' + localStorage.getItem('token')
            let header = {
                headers: {
                    'Authorization': `${token}`,
                }
            }
            axios.get(url, header)
                .then((res) => {
                    console.log(res)
                    this.beveragesRecomendation = res.data.data.data
                    this.nextBeveragesRecomendation = res.data.data.next_page_url
                    console.log(this.beveragesRecomendation, this.nextBeveragesRecomendation)
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
                    console.log(start, end, bedges)
                    return bedges
                } else if (data.id === maxLengtReff) {
                    let end = data.max_vote
                    bedges = (totalVoting >= end) ? data : []
                    console.log(end, bedges)
                    return bedges
                } else {
                    let start = bedgeReff[i -1].max_vote
                    let end = data.max_vote
                    bedges = (totalVoting >= start && totalVoting <= end) ? data : []
                    console.log(start, end, bedges)
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
            console.log(url, header)
            axios.get(url, header)
                .then((res) => {
                    let data = res.data.data.data
                    console.log(res, data)
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
            console.log(id)
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
                        console.log(res)
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
        vote: function () {
            $('#vouter').modal('show')
        }
    }
})

$('[data-toggle="tooltip"]').tooltip()
bsCustomFileInput.init()