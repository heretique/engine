import { Vec2 } from '../../math/vec2.js';
import { random } from '../../math/random.js';
import { LIGHTTYPE_DIRECTIONAL } from '../constants.js';
import { BakeLight } from './bake-light.js';

const _tempPoint = new Vec2();

class BakeLightSimple extends BakeLight {
    get numVirtualLights() {
        // only directional lights support multiple samples
        if (this.light.type === LIGHTTYPE_DIRECTIONAL) {
            return this.light.bakeNumSamples;
        }

        return 1;
    }

    prepareVirtualLight(index, numVirtualLights) {

        // set to original rotation
        const light = this.light;
        light._node.setLocalRotation(this.rotation);

        // random adjustment to the directional light facing
        if (index > 0) {
            const directionalSpreadAngle = light.bakeArea;
            random.spiralCirclePoint(_tempPoint, index, numVirtualLights);
            _tempPoint.mulScalar(directionalSpreadAngle * 0.5);
            light._node.rotateLocal(_tempPoint.x, 0, _tempPoint.y);
        }

        // update transform
        light._node.getWorldTransform();


        // TODO: this does not seem to work well and lightmap gets dark with more virtual lights
        light.intensity = this.intensity / numVirtualLights;
    }
}

export { BakeLightSimple };
