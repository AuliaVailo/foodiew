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
        profileCafe: [],
        profile: [],
        generalErrorMessage: '',
        guestProfile: [],
        route: localStorage.getItem('route'),
        telfon: 'tel:087803166974',
        imagePreview: '',
        defaultImage: './assets/img/Header.jpg',
        pictures: '',
        menuName: '',
        type: '',
        category: '',
        price: '',
        description: '',
        nameError: '',
        typeError: '',
        categoryError: '',
        descriptionError: '',
        priceError: '',
        trending_baverages: [],
        trending_foods: [],
        detailDialog: [],
        formDelete: [],
        formUpdate: [],
        nextBeverages: null,
        nextFoods: null,
        caffeId: '',
        cafeReview: '',
        cafeRate: 0,
        reviewId: ''
    },
    computed: {
        food: function () {
            return this.trending_foods.data
        },
        baverages: function () {
            return this.trending_baverages.data
        },
        profileUser: function () {
            if(this.isLogin) {
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
        this.caffeId = localStorage.getItem('route').split(':')[1]
        let token = localStorage.getItem('token')
        if (token !== null) {
            this.isLogin = 1
            if (localStorage.getItem('profile')) {
                this.profile = JSON.parse(localStorage.getItem('profile'))
            } else {
                this.getProfile()
            }
            if (localStorage.getItem('profile-cafe')) {
                this.profileCafe = JSON.parse(localStorage.getItem('profile-cafe'))
                this.caffeId = this.profileCafe.id
            } else {
                this.openThisCafe()
            }
        } else {
            // this.signout()
            if (localStorage.getItem('profile-cafe')) {
                this.profileCafe = JSON.parse(localStorage.getItem('profile-cafe'))
                this.caffeId = this.profileCafe.id
            } else {
                this.openThisCafe()
            }
        }
        console.log(this.profileCafe)
        this.getFoods()
        this.getBeverages()
    },
    methods: {
        signout: function () {
            localStorage.removeItem('token')
            localStorage.removeItem('userProfile')
            this.isLogin = 0
            window.location.replace('/')
        },
        addNewMenu: function () {
            const { maxSize } = this
            let imageFile = this.imageToUpload
            let formData = new FormData()
            console.log(imageFile)
            let size = imageFile.size / maxSize / maxSize
            if (!imageFile.type.match('image.*')) {
                // check whether the upload is an image
                this.generalErrorMessage = 'Please choose an image file'
                $('#generalModal').modal('show')
                return
            } else if (size>1) {
                // check whether the size is greater than the size limit
                this.generalErrorMessage = 'Your file is too big! Please select an image under 1MB'
                $('#generalModal').modal('show')
                return
            } else {
                // Append file into FormData and turn file into image URL
                formData.append('pictures[0]', imageFile);
            }

            this.isLoading = true
            let url = this.url + '/api/foods/register'
            let token = 'Bearer ' + localStorage.getItem('token')
            let header = {
                headers: {
                    'Authorization': `${token}`,
                    'Content-type': `multipart/form-data`
                }
            }

            formData.append('name', this.menuName)
            formData.append('type', this.type)
            formData.append('category', this.category)
            formData.append('price', this.price)
            formData.append('description', this.description)

            let payload = formData
            console.log('payload', payload)
            axios.post(url, payload, header)
                .then((res) => {
                    console.log(res)
                    this.isLoading = false
                    if (res.status === 200) {
                        this.generalErrorMessage = res.data.message
                        $('#generalModal').modal('show')
                        this.menuName = ''
                        this.type = ''
                        this.category = ''
                        this.description = ''
                        this.price = ''
                        this.imagePreview = this.defaultImage
                        let result = res.data.data
                        result.caffes = this.profile.caffe
                        if (res.data.data.type === '1') {
                            console.log('food', result)
                            this.trending_foods.data.push(result)
                        }

                        if (res.data.data.type === '2') {
                            console.log('baverages', result)
                            this.trending_baverages.data.push(result)
                        }
                        var form = document.getElementById('add-Food')
                        form.reset()
                        setTimeout(() => {
                            $('#generalModal').modal('hide')
                            $('#addFood').modal('hide')
                            // window.location.replace('/mycafe')
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
        openThisCafe: function(id) {
            console.log('id', id)
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
        readFile: function (e) {
            const file = e.target.files[0];
            this.imagePreview = URL.createObjectURL(file);
            this.imageToUpload = file
        },
        getFoods: function () {
            let url = this.url + '/api/foods/1/type/' + this.caffeId
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
        seeMoreFood: function (type) {
            let url
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
        getBeverages: function () {
            let url = this.url + '/api/foods/2/type/' + this.caffeId
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
        setDetail: function(id, type) {
            console.log(id, type)
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
        addReviewCafe: function () {
            this.isLoading = true
            let url = this.url + '/api/caffes/reviews'
            let token = 'Bearer ' + localStorage.getItem('token')
            let header = {
                headers: {
                    'Authorization': `${token}`,
                }
            }
            let payload = {
                id: this.caffeId,
                rate: this.cafeRate,
                review: this.cafeReview,
            }
            axios.post(url, payload, header)
                .then((res) => {
                    console.log(res)
                    this.isLoading = false
                    if (res.status === 200) {
                        this.generalErrorMessage = res.data.message
                        $('#generalModal').modal('show')
                        // add review to state
                        this.profileCafe.reviews.push(res.data.data)
                        localStorage.setItem('profile-cafe', JSON.stringify(this.profileCafe))
                        setTimeout(() => {
                            $('#generalModal').modal('hide')
                            $('#writeReviewDesktop').modal('hide')
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
                                $('#writeReviewDesktop').modal('hide')
                                that.signout()
                            }, 3000);
                        } else if (err.response.status === 500){
                            this.generalErrorMessage = err.response.data.message
                            $('#generalModal').modal('show')
                            setTimeout(() => {
                                $('#generalModal').modal('hide')
                                $('#writeReviewDesktop').modal('hide')
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
            $('#deleteReview').modal('show')
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
                    console.log(res)
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
    }
})

$('[data-toggle="tooltip"]').tooltip()
bsCustomFileInput.init()