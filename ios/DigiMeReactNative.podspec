
Pod::Spec.new do |s|
  s.name         = "DigiMeReactNative"
  s.version      = "1.0.0"
  s.summary      = "DigiMeReactNative"
  s.description  = <<-DESC
                  DigiMeReactNative
                   DESC
  s.homepage     = ""
  s.license      = "MIT"
  # s.license      = { :type => "MIT", :file => "FILE_LICENSE" }
  s.author             = { "author" => "dev-support@digi.me" }
  s.platform     = :ios, "7.0"
  s.source       = { :git => "https://github.com/digime/digime-sdk-react-native.git", :tag => "master" }
  s.source_files  = "DigiMeReactNative/**/*.{h,m}"
  s.requires_arc = true


  s.dependency "React"
  #s.dependency "others"

end

