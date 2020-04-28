const index = new Vue({
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
        formUpdate: []
    },
    computed: {
        food: function () {
            return this.trending_foods.data
        },
        baverages: function () {
            return this.trending_baverages.data
        },
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
        }
    },
    created () {
        localStorage.setItem('route', 'mycafe')
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
        console.log(this.profile)
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
        readFile: function (e) {
            const file = e.target.files[0];
            this.imagePreview = URL.createObjectURL(file);
            this.imageToUpload = file
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
        confirmDelete: function (id) {
            // console.log(this.food, id)
            let item = this.food.filter(el => {
                return el.id === id
            })
            if (item.length > 0) {
                this.formDelete = item[0]
                $('#deleteFood').modal('show')
            } else {
                let item = this.baverages.filter(el => {
                    return el.id === id
                })
                if (item.length > 0) {
                    this.formDelete = item[0]
                    $('#deleteFood').modal('show')
                }
            }
        },
        doDelete(id) {
            this.isLoading = true
            let url = this.url + '/api/foods/' + id
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
                        this.formDelete = []
                        // delete data from state
                        let sisa = this.trending_foods.data.filter(el => {
                            return el.id === id
                        })
                        if (sisa.length > 0) {
                            let sisa = this.trending_foods.data.filter(el => {
                                return el.id !== id
                            })
                            this.trending_foods.data = sisa
                        } else {
                            let sisa = this.trending_baverages.data.filter(el => {
                                return el.id === id
                            })
                            if (sisa.length > 0) {
                                let sisa = this.trending_baverages.data.filter(el => {
                                    return el.id !== id
                                })
                                this.trending_baverages.data = sisa
                            }
                        }
                        setTimeout(() => {
                            $('#generalModal').modal('hide')
                            $('#deleteFood').modal('hide')
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
        confirmEdit: function (id) {
            console.log(this.food, id)
            let item = this.food.filter(el => {
                return el.id === id
            })
            if (item.length > 0) {
                this.formUpdate = item[0]
                this.imagePreview = this.imageUrl + this.formUpdate.pictures
                this.menuName = this.formUpdate.name
                this.type = this.formUpdate.type
                this.category = this.formUpdate.category
                this.price = this.formUpdate.price
                this.description = this.formUpdate.description
                $('#updateFood').modal('show')
            } else {
                let item = this.baverages.filter(el => {
                    return el.id === id
                })
                if (item.length > 0) {
                    this.formUpdate = item[0]
                    this.imagePreview = this.imageUrl + this.formUpdate.pictures
                    this.menuName = this.formUpdate.name
                    this.type = this.formUpdate.type
                    this.category = this.formUpdate.category
                    this.price = this.formUpdate.price
                    this.description = this.formUpdate.description
                    $('#updateFood').modal('show')
                }
            }
            console.log(this.imagePreview)
        },
        doUpdate(id) {
            const { maxSize } = this
            let imageFile = this.imageToUpload
            let formData = new FormData()
            if (imageFile !== undefined) {
                console.log(imageFile)
                let size = imageFile.size / maxSize / maxSize
                if (size>1) {
                    // check whether the size is greater than the size limit
                    this.generalErrorMessage = 'Your file is too big! Please select an image under 1MB'
                    $('#generalModal').modal('show')
                    return
                } else {
                    formData.append('pictures[0]', imageFile);
                }
            }

            this.isLoading = true
            let url = this.url + '/api/foods/' + id
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
            formData.append('_method', 'PUT');
            let payload = formData

            console.log(url, header, formData)
            
            axios.post(url, payload, header)
                .then((res) => {
                    console.log(res, this.formUpdate.type, this.type)
                    this.isLoading = false
                    if (res.status === 200) {
                        this.generalErrorMessage = res.data.message
                        $('#generalModal').modal('show')
                        if (this.formUpdate.type !== this.type) {
                            window.location.replace('/mycafe')
                        } else {
                            if (this.type === '1') { // foods
                                let objIndex = this.trending_foods.data.findIndex((obj => obj.id == id))
                                this.trending_foods.data[objIndex] = res.data.data
                            }

                            if (this.type === '2') { // beverages
                                let objIndex = this.trending_baverages.data.findIndex((obj => obj.id == id))
                                this.trending_baverages.data[objIndex] = res.data.data
                            }
                        }
                        var form = document.getElementById('update_form')
                        form.reset()
                        form.reset()
                        setTimeout(() => {
                            $('#generalModal').modal('hide')
                            $('#updateFood').modal('hide')
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
        }
    }
})

$('[data-toggle="tooltip"]').tooltip()
bsCustomFileInput.init()