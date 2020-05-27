new Vue({
    el: '#app',
    data: { 
        // url: 'http://localhost:8000',
        url: 'https://tranquil-dawn-58446.herokuapp.com',
        urlStorage: 'https://images.traceofficial.com',
        imageUrl: '',
        profileUrl: '',
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
        thisCategories: [],
        nextMenu: '',
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
        confirmPasswordError: '',
        notification: [],
        nextNotif: '',
        allNotif: 0,
        location: '',
        rating: 1,
        review: '',
        rate: 0,
        foodCategories: [],
        baveragesCategories: [],
        category: 'city',
        globalSearch: "",
        isTyping: false,
        serachUser: [],
        serachCafe: [],
        serachMenu: []
    },
    watch: {
        globalSearch: _.debounce(function () {
          this.isTyping = false;
        }, 1000),
        isTyping: function (value) {
          if (!value) {
            this.searchData(this.globalSearch);
          }
        }
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
        if(localStorage.getItem('category')) {
            this.category = localStorage.getItem('category')
        }
        this.imageUrl = this.urlStorage + '/menus/'
        this.profileUrl = this.urlStorage + '/profiles/'
        let token = localStorage.getItem('token')
        if (token !== null) {
            this.isLogin = 1
            if (localStorage.getItem('profile')) {
                this.profile = JSON.parse(localStorage.getItem('profile'))
                this.getNotification()
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
                this.getNotification()
            }
        } else {
            // this.signout()
        }

        if(localStorage.getItem('myLocation')){
            this.location = JSON.parse(localStorage.getItem('myLocation'))
            this.getThisMenu()
        } else {
            this.getLocationIp()
        }
        this.gotoRandomPromo()
        // chek if notif command is apear
        let notifCommand = localStorage.getItem('pleaseOpen')
        if (notifCommand) {
            notifCommand = notifCommand.split('::')
            let route = notifCommand[0]
            if (route === 'profile') {
                this.search = notifCommand[2]
                setTimeout(() => {
                    $('#vouter').modal('show')
                    localStorage.removeItem('pleaseOpen')
                }, 1500);
            }
        }
        this.foodCategories = [
            {id: 1, name: 'Breads n Cereals', route: './breads', icon: './assets/img/logo-icon/bread.svg'},
            {id: 2, name: 'Rice n grains', route: './rice', icon: './assets/img/logo-icon/rice.svg'},
            {id: 3, name: 'Pasta n Noodles', route: './noodles', icon: './assets/img/logo-icon/noodles.svg'},
            {id: 4, name: 'Vegetable n Fruit', route: './vegefruit', icon: './assets/img/logo-icon/vegefruit.svg'},
            {id: 5, name: 'Cheese n others', route: './cheese', icon: './assets/img/logo-icon/cheese.svg'},
            {id: 6, name: 'Lean Meat n Poulty', route: './meat', icon: './assets/img/logo-icon/meat.svg'},
            {id: 7, name: 'Fish', route: './fish', icon: './assets/img/logo-icon/fish.svg'},
            {id: 8, name: 'Egg', route: './egg', icon: './assets/img/logo-icon/egg.svg'},
            {id: 9, name: 'Others', route: './other_food', icon: './assets/img/logo-icon/porridge.svg'},
        ]

        this.baveragesCategories = [
            {id: 10, name: 'Milk n Yoghurt', route: './milk', icon: './assets/img/logo-icon/milk.svg'},
            {id: 11, name: 'Shoft Drinks variant', route: './softdrink', icon: './assets/img/logo-icon/softdrink.svg'},
            {id: 12, name: 'Juicy Juice Drinks', route: './juice', icon: './assets/img/logo-icon/juice.svg'},
            {id: 13, name: 'Bear, wine, cinder, etc.', route: './beer_wine_cinder_spirits', icon: './assets/img/logo-icon/beer_wine_cinder_spirits.svg'},
            {id: 14, name: 'Tea variant drinks', route: './tea', icon: './assets/img/logo-icon/tea.svg'},
            {id: 15, name: 'Coffe variant drinks', route: './coffee', icon: './assets/img/logo-icon/coffee.svg'},
            {id: 16, name: 'Tasty Hot Chocolatte', route: './hot_chocolatte', icon: './assets/img/logo-icon/hot_chocolatte.svg'},
            {id: 17, name: 'Spirits, booze, etc.', route: './water', icon: './assets/img/logo-icon/water.svg'},
            {id: 18, name: 'other tasty drinks', route: './other_drinks', icon: './assets/img/logo-icon/others.svg'},
        ]
    },
    methods: {
        searchData: function (searchQuery) {
            let url = this.url + "/api/search/" + searchQuery;
            axios.get(url).then(response => {
              this.serachUser = response.data.data.user;
              this.serachCafe = response.data.data.cafe;
              this.serachMenu = response.data.data.menu;
            });
        },
        signout: function () {
            localStorage.removeItem('token')
            localStorage.removeItem('userProfile')
            this.isLogin = 0
            window.location.replace('/category')
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
            let url = this.url + '/api/users'
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

            array = that.thisCategories

            let result = array.filter(el => {
                return el.id === id
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
                    // const that = this
                    // if (err.response !== undefined) {
                    //     if(err.response.status === 401){
                    //         this.generalErrorMessage = 'Your session is expired, please login...'
                    //         $('#generalModal').modal('show')
                    //         setTimeout(() => {
                    //             $('#generalModal').modal('hide')
                    //             that.signout()
                    //         }, 3000);
                    //     } else {
                    //         this.generalErrorMessage = err.response.statusText
                    //     }
                    // } else {
                    //     this.generalErrorMessage = err
                    // }
                    // $('#generalModal').modal('show')
                    // setTimeout(() => {
                    //     $('#generalModal').modal('hide')
                    // }, 3000);
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
            this.detailDialog.promo = '1'
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
                {id: 1, name: 'Breads n Cereals'},
                {id: 2, name: 'Rice n grains'},
                {id: 3, name: 'Pasta n Noodles'},
                {id: 4, name: 'Vegetable n Fruit'},
                {id: 5, name: 'Cheese n others'},
                {id: 6, name: 'Lean Meat n Poulty'},
                {id: 7, name: 'Fish'},
                {id: 8, name: 'Egg'},
                {id: 9, name: 'Others'},
                {id: 10, name: 'Milk n Yoghurt'},
                {id: 11, name: 'Shoft Drinks variant'},
                {id: 12, name: 'Juicy Juice Drinks'},
                {id: 13, name: 'Bear, wine, cinder, etc.'},
                {id: 14, name: 'Tea variant drinks'},
                {id: 15, name: 'Coffe variant drinks'},
                {id: 16, name: 'Tasty Hot Chocolatte'},
                {id: 17, name: 'Spirits, booze, etc.'},
                {id: 18, name: 'other tasty drinks'},
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
        getThisMenu: async function() {
            let url = ''
            if (this.category === 'city') {
                url = this.url + '/api/foods/recomendation/7/category/' + this.location.city
            }

            if (this.category === 'all') {
                url = this.url + '/api/foods/recomendation/7/category/all'
            }
            // let token = 'Bearer ' + localStorage.getItem('token')
            let header = {
                // headers: {
                //     'Authorization': `${token}`,
                // }
            }
            axios.get(url, header)
                .then((res) => {
                    // console.log(res)
                    this.thisCategories = res.data.data.data
                    this.nextMenu = res.data.data.next_page_url
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
            let url = this.nextMenu

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
                    data.map(el => {this.thisCategories.push(el)})
                    this.nextMenu = res.data.data.next_page_url
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
        vote: function () {
            $('#vouter').modal('show')
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
        getNotification: function () {
            let url = this.url + '/api/notification'
            let token = 'Bearer ' + localStorage.getItem('token')
            let header = {
                headers: {
                    'Authorization': `${token}`,
                }
            }
            axios.get(url, header)
                .then((res) => {
                    this.notification = res.data.data.data
                    this.nextNotif = res.data.data.next_page_url
                    this.getTotalUnread()
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
                    // $('#generalModal').modal('show')
                    // setTimeout(() => {
                    //     $('#generalModal').modal('hide')
                    // }, 3000);
                })
        },
        getTotalUnread: function () {
            let url = this.url + '/api/notification/status/0'
            let token = 'Bearer ' + localStorage.getItem('token')
            let header = {
                headers: {
                    'Authorization': `${token}`,
                }
            }
            axios.get(url, header)
                .then((res) => {
                    console.log(res)
                    this.allNotif = res.data.data
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
                    // $('#generalModal').modal('show')
                    // setTimeout(() => {
                    //     $('#generalModal').modal('hide')
                    // }, 3000);
                })
        },
        updateNotif: async function (id) {
            this.isLoading = true
            let url = this.url + '/api/notification/' + id
            let token = 'Bearer ' + localStorage.getItem('token')
            let header = {
                headers: {
                    'Authorization': `${token}`,
                }
            }
            let payload = {

            }
            try {
                const response = await axios.put(url, payload, header)
                this.isLoading = false
                this.allNotif--
                return response.data
            } catch (err) {
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
                // $('#generalModal').modal('show')
                // setTimeout(() => {
                //     $('#generalModal').modal('hide')
                // }, 3000);
            }
        },
        checkNotif: async function (target, id) {
            let param = target.split('::')
            let route = param[0]

            const update = await this.updateNotif(id)
            if (update.status === 200) {
                if (route === 'profile') {
                    this.search = param[1]
                    $('#vouter').modal('show')
                }
    
                if (route === 'mycafe') {
                    let type = param[1]
                    let id = param[2]
    
                    if (type === '0' || type === 0) { // only open mycafe
                        localStorage.setItem('pleaseOpen', 'mycafe::0')
                        window.location.replace('/mycafe')
                    }
    
                    if (type === '1' || type === 1) { // only open mycafe, and open modal food with id
                        localStorage.setItem('pleaseOpen', 'mycafe::1::' + id)
                        window.location.replace('/mycafe')
                    }
    
                    if (type === '2' || type === 2) { // only open mycafe, and open modal baverages with id
                        localStorage.setItem('pleaseOpen', 'mycafe::2::' + id)
                        window.location.replace('/mycafe')
                    }
                }
            }
        },
        seeMoreNotif: function () {
            let url = this.nextNotif
            let token = 'Bearer ' + localStorage.getItem('token')
            let header = {
                headers: {
                    'Authorization': `${token}`,
                }
            }
            axios.get(url, header)
                .then((res) => {
                    let dataNotif = res.data.data.data
                    dataNotif.map(el => this.notification.push(el))
                    this.nextNotif = res.data.data.next_page_url
                    this.allNotif = res.data.data.total
                    console.log(this.notification, this.nextNotif)
                    $('#notificationMenu').click()
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
                    // $('#generalModal').modal('show')
                    // setTimeout(() => {
                    //     $('#generalModal').modal('hide')
                    // }, 3000);
                })
        },
        seeMoreNotif2: function () {
            let url = this.nextNotif
            let token = 'Bearer ' + localStorage.getItem('token')
            let header = {
                headers: {
                    'Authorization': `${token}`,
                }
            }
            axios.get(url, header)
                .then((res) => {
                    let dataNotif = res.data.data.data
                    dataNotif.map(el => this.notification.push(el))
                    this.nextNotif = res.data.data.next_page_url
                    this.allNotif = res.data.data.total
                    console.log(this.notification, this.nextNotif)
                    $('#notificationMenu2').click()
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
                    this.getThisMenu()
                })
                .catch((err) => {
                    console.error(err)
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
                        if(this.detailDialog.promo === '1') {
                            let objIndex = this.promos.findIndex((obj => obj.details.id === this.detailDialog.id))
                            this.promos[objIndex].details.reviews.push(res.data.data)
                        } else {
                            let objIndex = this.thisCategories.findIndex((obj => obj.id === this.detailDialog.id))
                            this.thisCategories[objIndex].reviews.push(res.data.data)
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
        confirmDeleteReveiw: function(reviewId) {
            this.reviewId = reviewId
            this.type = ''
            this.menuId = ''
            $('#deleteReview').modal('show')
        },
        confirmDeleteReveiwFoodBaverages: function(reviewId, type, menuId) {
            // console.log(reviewId, type, menuId)
            this.reviewId = reviewId
            this.type = type
            this.menuId = menuId
            $('#deleteReview').modal('show')
        },
        doDeleteReviewFoodBaverages: function() {
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
        doDelete: function() {
            $('#deleteReview').modal('hide')
            this.isLoading = true
            let url = this.url + '/api/caffes/reviews/' + this.reviewId
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
                        let review = this.profileCafe.reviews.filter(el => {
                            return el.id !== this.reviewId
                        })
                        this.profileCafe.reviews = review
                        localStorage.setItem('profile-cafe', JSON.stringify(this.profileCafe))
                        setTimeout(() => {
                            $('#generalModal').modal('hide')
                            $('#deleteReview').modal('hide')
                            
                            this.reviewId = ''
                            this.caffeId = this.profileCafe.id
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
        showSearch: function () {
            $("#search").modal("show");
        },
        countRating: function (reviews) {
            let rate = 0;
            let totalRating = 0;
            let totalData = 1;
            if (reviews.length) {
              reviews.map(el => {
                totalRating += el.rating;
                totalData++;
              });
              rate = totalRating / totalData;
            } else {
              rate = 1;
            }
      
            return Number(Math.round(rate));
        }
    }
})