import Api from './Api'
import TicketDashboardController from './TicketDashboardController'
import TicketReviewController from './TicketReviewController'
import EvalController from './EvalController'
import EvalCaseController from './EvalCaseController'
import AiAgentController from './AiAgentController'
import Settings from './Settings'
import Auth from './Auth'

const Controllers = {
    Api: Object.assign(Api, Api),
    TicketDashboardController: Object.assign(TicketDashboardController, TicketDashboardController),
    TicketReviewController: Object.assign(TicketReviewController, TicketReviewController),
    EvalController: Object.assign(EvalController, EvalController),
    EvalCaseController: Object.assign(EvalCaseController, EvalCaseController),
    AiAgentController: Object.assign(AiAgentController, AiAgentController),
    Settings: Object.assign(Settings, Settings),
    Auth: Object.assign(Auth, Auth),
}

export default Controllers