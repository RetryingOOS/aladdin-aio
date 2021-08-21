{
  "variables": {
    "module_path": "./build",
    "PRODUCT_DIR": "./build/Release"
  },
  'target_defaults': {
    'defines': [
      'CBC=1',
      'AES256=1'
    ]
  },
  'targets': [
    {
      'target_name': 'main',
      'sources': [
        'source/main.cpp',
        'source/aes/aes.c'
      ],
      'includes': [
        './common.gypi'
      ]
    },
    {
      "target_name": "action_after_build",
      "type": "none",
      "dependencies": [ "main" ],
      "copies": [
        {
          "files": [ ".app/main.node" ],
          "destination": "<(module_path)"
        }
      ]
    }
  ]
}
