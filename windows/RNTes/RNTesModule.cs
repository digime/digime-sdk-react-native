using ReactNative.Bridge;
using System;
using System.Collections.Generic;
using Windows.ApplicationModel.Core;
using Windows.UI.Core;

namespace Tes.RNTes
{
    /// <summary>
    /// A module that allows JS to share data.
    /// </summary>
    class RNTesModule : NativeModuleBase
    {
        /// <summary>
        /// Instantiates the <see cref="RNTesModule"/>.
        /// </summary>
        internal RNTesModule()
        {

        }

        /// <summary>
        /// The name of the native module.
        /// </summary>
        public override string Name
        {
            get
            {
                return "RNTes";
            }
        }
    }
}
