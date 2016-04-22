'use strict'

/* jshint -W098 */
export class SidenavController {

    constructor($mdSidenav, $mdDialog, $location) {
        'ngInject'

        this.toggleSidenav = function (menuId) {
            $mdSidenav(menuId).toggle()
        }

        this.selected = null
        this.selectItem = function (item, menuId) {
            this.selected = item
            // get the sidenav
            let sidenav = $mdSidenav(menuId)
            if (sidenav.isOpen()) { // check if it is open & close it if so
                sidenav.close()
            }
            $location.path('/' + item.toLowerCase())
        }
        this.title = 'Face Emotion Recognition'
        this.items = ['Image', 'Video']
    }
}

export class ToolbarController {
    constructor($mdSidenav) {
        'ngInject'
        this.toggleSidenav = function (menuId) {
            $mdSidenav(menuId).toggle()
        }
    }
}
