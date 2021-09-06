import * as vscode from 'vscode';
import axios from 'axios';

// 插件激活时执行
export function activate(context: vscode.ExtensionContext) {
	// 注册命令
	const cityWeather = vscode.commands.registerCommand('myextension.fetchCityWeather', () => {
		// 输入指令
		vscode.window.showInputBox({
			ignoreFocusOut: true,
			password: false,
			prompt: '请输入城市名称 (eg.北京)'
		}).then(val => {
			if (!val || !val.trim()) {
				vscode.window.showInformationMessage('请输入城市名称');
			} else {
				const cityName = val.trim();
				axios.get(encodeURI(`https://way.jd.com/jisuapi/weather?city=${cityName}&appkey=40e91431e978390daf06b07704a9523c`)).then(res => {
					const { code, result } = res.data;
					if (code !== '10000') {
						vscode.window.showInformationMessage('请重试');
						return;
					}
					if (result.status !== 0) {
						vscode.window.showInformationMessage(result.msg);
						return;
					}
					const { result: data } = result;
					vscode.window.showInformationMessage(`${data.city} ${data.weather} 气温${data.templow}~${data.temphigh}℃ 空气湿度${data.humidity} ${data.winddirect} 风力${data.windpower}`);
				});
			}
		});
	});




	// let disposable = vscode.commands.registerCommand('myextension.fetchCityWeather', () => {
	// 	vscode.window.showInformationMessage('Hello World from myextension');
	// });
	context.subscriptions.push(cityWeather);
}

// 插件被停用时执行
export function deactivate() {}
