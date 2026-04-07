import subprocess
import time
import os

os.chdir(r'e:\codebuddy\goldnine')

# 使用 cmd 运行命令
def deploy_function(name):
    print(f'\n部署 {name}...')
    proc = subprocess.Popen(
        ['cmd', '/c', 'tcb', 'fn', 'deploy', name, '--env-id', 'goldnine-hk-8g3g5ijhec9df56e'],
        stdin=subprocess.PIPE,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True,
        shell=True
    )
    
    time.sleep(2)
    out, err = proc.communicate(input='y\n\ny\n', timeout=120)
    print(out[-500:] if len(out) > 500 else out)
    print(f'{name} 部署完成')

try:
    deploy_function('github-register-task')
    deploy_function('account-manager')
    print('\n✓ 所有云函数部署完成！')
except Exception as e:
    print(f'错误: {e}')
