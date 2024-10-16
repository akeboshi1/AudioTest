import { _decorator, Component, Node, Animation, Enum } from "cc";
const { ccclass, property } = _decorator;
import { BackPackUI } from "./BackPackUI";
import { ShopUI } from "./ShopUI";
import { ChallengeUI } from "./ChallengeUI";
import { PanelType } from "./PanelType";
import Recorder from 'js-audio-recorder'

@ccclass
export class HomeUI extends Component {
    @property(Animation)
    menuAnim: Animation = null!;
    @property(BackPackUI)
    backPackUI: BackPackUI = null!;
    @property(ShopUI)
    shopUI: ShopUI = null!;
    @property(ChallengeUI)
    challengeUI: ChallengeUI = null!;

    private recorder:any;

    public curPanel = PanelType.Home;

    // use this for initialization
    onLoad() {
        this.curPanel = PanelType.Home;

        // this.menuAnim.play('menu_reset');
    }

    start() {
        this.backPackUI.init(this);
        this.shopUI.init(this, PanelType.Shop);
        this.challengeUI.init(this);
        this.scheduleOnce(() => {
            this.menuAnim.play('menu_intro');
        }, 0.5);
        console.log(Recorder);
        this.recorder = new Recorder({
            sampleBits: 16, // 采样位数，支持 8 或 16，默认是16
            sampleRate: 16000, // 采样率，支持 11025、16000、22050、24000、44100、48000，根据浏览器默认值，我的chrome是48000
            numChannels: 1
        });
    }

    gotoShop() {
        if (this.curPanel !== PanelType.Shop) {
            this.shopUI.show();
        }
        if(this.recorder){
            this.recorder.stopPlay();
            let wavBlob = this.recorder.getWAVBlob();
            let blob = new Blob([wavBlob], { type: 'audio/wav' });
            const url = URL.createObjectURL(blob);
            // 创建一个 <a> 元素
            let a = document.createElement('a');
            a.style.display = 'none';
            document.body.appendChild(a);

            // 设置 <a> 元素的 URL 和文件名，并触发下载
            a.href = url;
            a.download = 'test.wav';
            a.click();

            // 释放 URL 对象
            URL.revokeObjectURL(url);
        }
    }

    gotoHome() {
        //todo 声音采集
        this.recorder.start().then(
            () => {
                // 开始录音
                console.log('开始录音了=========')
            },
            (error) => {
                // 出错了
                console.log(error)
            }
        )
        console.log("webaudio===>",this.recorder);
        if (this.curPanel === PanelType.Shop) {
            this.shopUI.hide();
            this.curPanel = PanelType.Home;
        }
    }
}
