import { all } from 'redux-saga/effects'
import { locationSaga } from 'decentraland-dapps/dist/modules/location/sagas'

import { walletSaga } from 'modules/wallet/sagas'
import { translationSaga } from 'modules/translation/sagas'
import { assetPackSaga } from 'modules/assetPack/sagas'
import { sceneSaga } from 'modules/scene/sagas'
import { projectSaga } from 'modules/project/sagas'
import { editorSaga } from 'modules/editor/sagas'
import { keyboardSaga } from 'modules/keyboard/sagas'

export function* rootSaga() {
  yield all([locationSaga(), translationSaga(), walletSaga(), assetPackSaga(), sceneSaga(), projectSaga(), editorSaga(), keyboardSaga()])
}
