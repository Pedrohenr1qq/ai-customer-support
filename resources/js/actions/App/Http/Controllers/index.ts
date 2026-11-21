import Api from './Api'
import TicketDashboardController from './TicketDashboardController'
import TicketReviewController from './TicketReviewController'
import EvalController from './EvalController'
import ApiTokenController from './ApiTokenController'
import Settings from './Settings'
import Auth from './Auth'

const Controllers = {
    Api: Object.assign(Api, Api),
    TicketDashboardController: Object.assign(TicketDashboardController, TicketDashboardController),
    TicketReviewController: Object.assign(TicketReviewController, TicketReviewController),
    EvalController: Object.assign(EvalController, EvalController),
    ApiTokenController: Object.assign(ApiTokenController, ApiTokenController),
    Settings: Object.assign(Settings, Settings),
    Auth: Object.assign(Auth, Auth),
}

export default Controllers