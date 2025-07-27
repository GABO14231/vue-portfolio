import {ref} from 'vue';

class UrlService
{
    _previousUrl = ref(undefined);
    _currentUrl = ref(undefined);
    previousUrl = this._previousUrl;
    currentUrl = this._currentUrl;

    initialize(router)
    {
        this._currentUrl.value = router.currentRoute.value.fullPath;
        router.afterEach((to, from) =>
        {
            this._previousUrl.value = from.fullPath;
            this._currentUrl.value = to.fullPath;
        });
    }
    getPreviousUrl() {return this._previousUrl.value;}
}

export const urlService = new UrlService();