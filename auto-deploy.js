const { spawn } = require('child_process');
const path = require('path');

function deployFunction(name) {
  return new Promise((resolve, reject) => {
    console.log(`\n部署 ${name}...`);
    
    const proc = spawn('tcb', ['fn', 'deploy', name, '--env-id', 'goldnine-hk-8g3g5ijhec9df56e'], {
      cwd: path.join(__dirname),
      shell: true,
      stdio: ['pipe', 'pipe', 'pipe']
    });
    
    let output = '';
    let error = '';
    
    proc.stdout.on('data', (data) => {
      const text = data.toString();
      output += text;
      // 只打印关键信息
      if (text.includes('部署成功') || text.includes('error') || text.includes('Error')) {
        process.stdout.write(text);
      }
    });
    
    proc.stderr.on('data', (data) => {
      error += data.toString();
    });
    
    // 等待一下然后发送输入
    setTimeout(() => {
      proc.stdin.write('y\n');
      
      setTimeout(() => {
        proc.stdin.write('\n');
        
        setTimeout(() => {
          proc.stdin.end();
          
          proc.on('close', (code) => {
            if (output.includes('部署成功') || code === 0) {
              console.log(`${name} ✓ 部署完成`);
              resolve(true);
            } else {
              console.log(`${name} 输出:`, output.slice(-200));
              reject(new Error(error || '部署失败'));
            }
          });
        }, 15000);
      }, 3000);
    }, 3000);
    
    setTimeout(() => {
      proc.kill();
      resolve(false);
    }, 60000);
  });
}

async function main() {
  try {
    await deployFunction('github-register-task');
    await deployFunction('account-manager');
    console.log('\n✓ 所有云函数部署完成！');
  } catch (error) {
    console.error('\n✗ 部署出错:', error.message);
  }
}

main().catch(console.error);
