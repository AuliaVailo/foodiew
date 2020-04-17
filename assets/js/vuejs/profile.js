const index = new Vue({
    el: '#app',
    data: { 
        url: 'https://tranquil-dawn-58446.herokuapp.com',
        title: 'foodiew',
        isLogin: 0,
        items: [],
        isLoading: false,
        profile: []
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
        console.log(this.profile)
    },
    methods: {
        signout: function () {
            localStorage.removeItem('token')
            localStorage.removeItem('userProfile')
            this.isLogin = 0
        },
        getProfile: function () {
            let url = this.url + '/api/users'
            let token = 'Bearer' + localStorage.getItem('token')
            let header = {
                headers: {
                    'Authorization': `${token}`,
                }
            }
            axios.get(url, header)
                .then((res) => {
                    console.log(res)
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
        getListItems: function () {
            // let url = 'https://api.foodiew.com/getlist'
            // axios.get(url)
            //     .then((res) => {
            //        this.items,push(res)
            //     })
            //     .catch((err) => {
            //         console.log(err)
            //     })
        }
    }
})