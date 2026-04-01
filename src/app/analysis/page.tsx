'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Upload,
  Video,
  Camera,
  FileVideo,
  Check,
  Loader2,
  Zap,
  Target,
  Activity,
  TrendingUp,
} from 'lucide-react';

const analysisTypes = [
  {
    id: 'grip',
    name: '握杆分析',
    description: '握杆姿势、手肘位置、杆法选择',
    icon: Target,
  },
  {
    id: 'stance',
    name: '站位分析',
    description: '重心分布、脚部位置、身体稳定性',
    icon: Activity,
  },
  {
    id: 'power',
    name: '发力分析',
    description: '发力轨迹、力度控制、节奏把握',
    icon: Zap,
  },
  {
    id: 'comprehensive',
    name: '综合分析',
    description: '推荐（包含以上全部内容）',
    icon: TrendingUp,
    recommended: true,
  },
];

export default function AIAnalysisPage() {
  const router = useRouter();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [selectedType, setSelectedType] = useState('comprehensive');
  const [note, setNote] = useState('');
  const [uploading, setUploading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // 验证文件类型
      if (!file.type.startsWith('video/')) {
        alert('请选择视频文件');
        return;
      }

      // 验证文件大小（最大100MB）
      if (file.size > 100 * 1024 * 1024) {
        alert('视频文件不能超过100MB');
        return;
      }

      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleSubmit = async () => {
    if (!selectedFile) {
      alert('请先上传视频');
      return;
    }

    setUploading(true);
    try {
      // 模拟上传
      await new Promise((resolve) => setTimeout(resolve, 2000));

      setUploading(false);
      setAnalyzing(true);

      // 模拟分析过程
      await new Promise((resolve) => setTimeout(resolve, 3000));

      // 跳转到分析结果页
      router.push('/analysis/result/1');
    } catch (error) {
      console.error('提交失败:', error);
      alert('提交失败，请重试');
    } finally {
      setUploading(false);
      setAnalyzing(false);
    }
  };

  if (analyzing) {
    return <AnalyzingProgress />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部导航 */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900">
              <span>返回</span>
            </Link>
            <h1 className="text-xl font-bold text-gray-900">AI动作分析</h1>
            <div className="w-16"></div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* 上传区域 */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">上传视频</h2>

          {!previewUrl ? (
            <label className="block border-2 border-dashed border-gray-300 rounded-lg p-12 text-center cursor-pointer hover:border-green-700 transition-colors">
              <input
                type="file"
                accept="video/*"
                onChange={handleFileSelect}
                className="hidden"
              />
              <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-lg text-gray-700 mb-2">点击上传视频</p>
              <p className="text-sm text-gray-500 mb-4">或拖拽视频文件到此处</p>
              <div className="flex items-center justify-center space-x-4">
                <div className="flex items-center space-x-2 px-4 py-2 bg-green-700 text-white rounded-lg">
                  <Camera className="w-4 h-4" />
                  <span>拍摄新视频</span>
                </div>
                <div className="flex items-center space-x-2 px-4 py-2 bg-gray-700 text-white rounded-lg">
                  <FileVideo className="w-4 h-4" />
                  <span>从相册选择</span>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-4">
                支持格式：MP4、MOV、AVI | 时长：5-30秒 | 最大：100MB
              </p>
            </label>
          ) : (
            <div className="space-y-4">
              <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
                <video
                  src={previewUrl}
                  controls
                  className="w-full h-full object-contain"
                />
              </div>
              <button
                onClick={() => {
                  setSelectedFile(null);
                  setPreviewUrl('');
                }}
                className="w-full py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                重新选择
              </button>
            </div>
          )}
        </div>

        {/* 选择分析类型 */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">选择分析类型</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {analysisTypes.map((type) => {
              const Icon = type.icon;
              return (
                <button
                  key={type.id}
                  onClick={() => setSelectedType(type.id)}
                  className={`relative p-4 border-2 rounded-lg text-left transition-all ${
                    selectedType === type.id
                      ? 'border-green-700 bg-green-50'
                      : 'border-gray-200 hover:border-green-700'
                  }`}
                >
                  {type.recommended && (
                    <div className="absolute top-2 right-2 bg-yellow-400 text-white text-xs px-2 py-1 rounded">
                      推荐
                    </div>
                  )}
                  <div className="flex items-start space-x-3">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        selectedType === type.id
                          ? 'bg-green-700 text-white'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 mb-1">{type.name}</h3>
                      <p className="text-sm text-gray-600">{type.description}</p>
                    </div>
                    {selectedType === type.id && (
                      <Check className="w-5 h-5 text-green-700 flex-shrink-0" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 备注 */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">备注说明（可选）</h2>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="请描述您想重点分析的部分..."
            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
            rows={4}
          />
        </div>

        {/* 提交按钮 */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm text-gray-600">
              <p>预计耗时：30秒</p>
              <p>消耗：1次免费额度</p>
            </div>
          </div>
          <button
            onClick={handleSubmit}
            disabled={!selectedFile || uploading}
            className="w-full py-3 bg-gradient-to-r from-green-700 to-green-600 text-white rounded-lg font-medium hover:from-green-800 hover:to-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all"
          >
            {uploading ? (
              <span className="flex items-center justify-center space-x-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>上传中...</span>
              </span>
            ) : (
              '开始分析'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// 分析进度组件
function AnalyzingProgress() {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    { text: '视频上传完成', completed: true },
    { text: '关键帧提取完成', completed: true },
    { text: '动作识别中...', completed: false },
    { text: '人体关键点检测中...', completed: false },
    { text: '生成分析报告中...', completed: false },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 flex items-center justify-center">
      <div className="max-w-md w-full mx-4 bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Video className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">AI正在分析您的视频</h2>
          <p className="text-gray-600">请稍候，分析过程约需30秒</p>
        </div>

        {/* 进度条 */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>分析进度</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* 步骤列表 */}
        <div className="space-y-3">
          {steps.map((step, index) => (
            <div key={index} className="flex items-center space-x-3">
              {step.completed ? (
                <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                  <Check className="w-4 h-4 text-white" />
                </div>
              ) : (
                <div className="w-6 h-6 rounded-full border-2 border-gray-300 flex items-center justify-center">
                  <Loader2 className="w-4 h-4 text-gray-400 animate-spin" />
                </div>
              )}
              <span className={step.completed ? 'text-gray-900' : 'text-gray-600'}>
                {step.text}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
