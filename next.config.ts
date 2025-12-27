import type { NextConfig } from "next";

// next.config.js - ILLUMRA Updated Redirect Configuration
// Based on actual staging site URLs at illumra-next.vercel.app
// Last updated: December 2024

const nextConfig: NextConfig = {
  env: {
    // Matches the behavior of `sanity dev` which sets styled-components to use the fastest way of inserting CSS rules in both dev and production. It's default behavior is to disable it in dev mode.
    SC_DISABLE_SPEEDY: "false",
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        pathname: "/images/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "static.wixstatic.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "kaylac929.wixsite.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "drive.google.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "illumra.com",
        pathname: "/**",
      },
    ],
  },
  async redirects() {
    return [
      // ============================================
      // PART NUMBER SHORTLINKS (Critical - used on printed materials)
      // ============================================

      // Switches - Product Page Shortlinks
      {
        source: "/p/E9T-S1Axx",
        destination: "/products/single-rocker-wireless-light-switch",
        permanent: true,
      },
      {
        source: "/p/E9T-S2Axx",
        destination: "/products/dual-rocker-wireless-light-switch",
        permanent: true,
      },
      {
        source: "/p/E9T-S2HXX",
        destination: "/products/handheld-remote-wireless-light-switch",
        permanent: true,
      },
      {
        source: "/p/E9T-C2AWH",
        destination: "/products/wireless-key-card-switch",
        permanent: true,
      },
      {
        source: "/p/BTT-S2Axx",
        destination: "/products/bluetooth-switch",
        permanent: true,
      },
      {
        source: "/p/BTT-S1Axx",
        destination: "/products/bluetooth-switch",
        permanent: true,
      },
      {
        source: "/p/ZBT-S1Axx",
        destination: "/products/zigbee-switch",
        permanent: true,
      },
      {
        source: "/p/ZBT-S2Axx",
        destination: "/products/dual-rocker-zigbee-switch",
        permanent: true,
      },

      // Controllers - Product Page Shortlinks
      {
        source: "/p/E9X-RUV-4IBTP",
        destination: "/products/100-277vac-relay",
        permanent: true,
      },
      {
        source: "/p/E9T-RUV-3HOTP",
        destination: "/products/3-wire-relay-receiver",
        permanent: true,
      },
      {
        source: "/p/E9X-DUV-10VTP-FX",
        destination: "/products/0-10v-5a-area-fixture-controller",
        permanent: true,
      },
      {
        source: "/p/E9X-DUV-10VTP",
        destination: "/products/20a-0-10v-dimming-area-controller",
        permanent: true,
      },
      {
        source: "/p/E9X-ER6CD",
        destination: "/products/600-watt-phase-cut-dimming-controller",
        permanent: true,
      },
      {
        source: "/p/E9X-D02FL",
        destination: "/products/constant-voltage-led-dimmer",
        permanent: true,
      },
      {
        source: "/p/E9R-R04FP",
        destination: "/products/8-channel-low-voltage-controller",
        permanent: true,
      },
      {
        source: "/p/E9X-HSM",
        destination: "/products/hvac-setback-module",
        permanent: true,
      },
      {
        source: "/p/E9X-HSM-2",
        destination: "/products/hvac-setback-module",
        permanent: true,
      },
      {
        source: "/p/E9X-CUV",
        destination: "/products/cuv-control-transmitter",
        permanent: true,
      },
      {
        source: "/p/BTX-DUV-10VFX",
        destination: "/products/bluetooth-mesh-power-pack",
        permanent: true,
      },
      {
        source: "/p/BTX-DUV-OCC",
        destination: "/products/nwo-duv-occ",
        permanent: true,
      },

      // Sensors - Product Page Shortlinks
      {
        source: "/p/E9T-OSH",
        destination: "/products/high-bay-ceiling-occupancy-sensor",
        permanent: true,
      },
      {
        source: "/p/E9T-MDCCP",
        destination: "/products/wireless-window-door-sensor",
        permanent: true,
      },
      {
        source: "/p/E9T-MCS",
        destination: "/products/wireless-window-door-sensor",
        permanent: true,
      },
      {
        source: "/p/NWO-OFX",
        destination: "/products/bluetooth-pir-occupancy-sensor",
        permanent: true,
      },

      // Kits - Product Page Shortlinks
      {
        source: "/p/E9K-B11WH",
        destination: "/products/basic-wireless-switch-kit",
        permanent: true,
      },

      // ============================================
      // DATASHEET SHORTLINKS (/p/PART/ds/)
      // Update these paths to match where you store PDFs on new site
      // ============================================
      {
        source: "/p/E9T-S1Axx/ds",
        destination: "/assets/datasheets/E9T-S1Axx_ds_AHD0201E.pdf",
        permanent: true,
      },
      {
        source: "/p/E9T-S1Axx/ds/",
        destination: "/assets/datasheets/E9T-S1Axx_ds_AHD0201E.pdf",
        permanent: true,
      },
      {
        source: "/p/E9T-S2Axx/ds",
        destination: "/assets/datasheets/E9T-S2Axx_ds_AHD0692B.pdf",
        permanent: true,
      },
      {
        source: "/p/E9T-S2Axx/ds/",
        destination: "/assets/datasheets/E9T-S2Axx_ds_AHD0692B.pdf",
        permanent: true,
      },
      {
        source: "/p/E9X-RUV-4IBTP/ds",
        destination: "/assets/datasheets/E9X-RUV-4IBTP_DS_AHD0578C.pdf",
        permanent: true,
      },
      {
        source: "/p/E9X-RUV-4IBTP/ds/",
        destination: "/assets/datasheets/E9X-RUV-4IBTP_DS_AHD0578C.pdf",
        permanent: true,
      },
      {
        source: "/p/E9T-OBP/ds",
        destination: "/assets/datasheets/E9T-OBP-DS_AHD0698A.pdf",
        permanent: true,
      },
      {
        source: "/p/E9T-OBP/ds/",
        destination: "/assets/datasheets/E9T-OBP-DS_AHD0698A.pdf",
        permanent: true,
      },
      {
        source: "/p/E9T-S2HXX/ds",
        destination: "/assets/datasheets/E9T-S2Hxx_ds_AHD0676D.pdf",
        permanent: true,
      },
      {
        source: "/p/E9T-S2HXX/ds/",
        destination: "/assets/datasheets/E9T-S2Hxx_ds_AHD0676D.pdf",
        permanent: true,
      },
      {
        source: "/p/E9T-C2AWH/ds",
        destination: "/assets/datasheets/E9T-C2AWH_ds_AHD0693B.pdf",
        permanent: true,
      },
      {
        source: "/p/E9T-C2AWH/ds/",
        destination: "/assets/datasheets/E9T-C2AWH_ds_AHD0693B.pdf",
        permanent: true,
      },
      {
        source: "/p/E9T-RUV-3HOTP/ds",
        destination: "/assets/datasheets/E9X-RUV-3HOTP_DS_AHD0635B.pdf",
        permanent: true,
      },
      {
        source: "/p/E9T-RUV-3HOTP/ds/",
        destination: "/assets/datasheets/E9X-RUV-3HOTP_DS_AHD0635B.pdf",
        permanent: true,
      },
      {
        source: "/p/E9X-DUV-10VTP-FX/ds",
        destination: "/assets/datasheets/E9X-DUV-10VTP-FX_DS_AHD0588B.pdf",
        permanent: true,
      },
      {
        source: "/p/E9X-DUV-10VTP-FX/ds/",
        destination: "/assets/datasheets/E9X-DUV-10VTP-FX_DS_AHD0588B.pdf",
        permanent: true,
      },
      {
        source: "/p/E9X-DUV-10VTP/ds",
        destination: "/assets/datasheets/E9X-DUV-10VTP_DS_AHD0566D.pdf",
        permanent: true,
      },
      {
        source: "/p/E9X-DUV-10VTP/ds/",
        destination: "/assets/datasheets/E9X-DUV-10VTP_DS_AHD0566D.pdf",
        permanent: true,
      },
      {
        source: "/p/E9X-ER6CD/ds",
        destination: "/assets/datasheets/E9X-ER6CD_DS_AHD0644B.pdf",
        permanent: true,
      },
      {
        source: "/p/E9X-ER6CD/ds/",
        destination: "/assets/datasheets/E9X-ER6CD_DS_AHD0644B.pdf",
        permanent: true,
      },
      {
        source: "/p/E9X-D02FL/ds",
        destination: "/assets/datasheets/E9X-D02FL-DS_AHD0211G.pdf",
        permanent: true,
      },
      {
        source: "/p/E9X-D02FL/ds/",
        destination: "/assets/datasheets/E9X-D02FL-DS_AHD0211G.pdf",
        permanent: true,
      },
      {
        source: "/p/E9R-R04FP/ds",
        destination: "/assets/datasheets/E9R-R04FP_DS_AHD0209D.pdf",
        permanent: true,
      },
      {
        source: "/p/E9R-R04FP/ds/",
        destination: "/assets/datasheets/E9R-R04FP_DS_AHD0209D.pdf",
        permanent: true,
      },
      {
        source: "/p/E9T-MDCCP/ds",
        destination: "/assets/datasheets/E9T-MDCCP_DS_AHD0672B.pdf",
        permanent: true,
      },
      {
        source: "/p/E9T-MDCCP/ds/",
        destination: "/assets/datasheets/E9T-MDCCP_DS_AHD0672B.pdf",
        permanent: true,
      },
      {
        source: "/p/E9T-MCS/ds",
        destination: "/assets/datasheets/E9T-MCS_DS_AHD0695A.pdf",
        permanent: true,
      },
      {
        source: "/p/E9T-MCS/ds/",
        destination: "/assets/datasheets/E9T-MCS_DS_AHD0695A.pdf",
        permanent: true,
      },
      {
        source: "/p/E9X-CUV/ds",
        destination: "/assets/datasheets/E9X-CUV_DS_AHD0587C.pdf",
        permanent: true,
      },
      {
        source: "/p/E9X-CUV/ds/",
        destination: "/assets/datasheets/E9X-CUV_DS_AHD0587C.pdf",
        permanent: true,
      },
      {
        source: "/p/NWC-500U/ds",
        destination: "/assets/datasheets/NWC-500U_ds_AHD0703A.pdf",
        permanent: true,
      },
      {
        source: "/p/NWC-500U/ds/",
        destination: "/assets/datasheets/NWC-500U_ds_AHD0703A.pdf",
        permanent: true,
      },
      {
        source: "/p/BTX-DUV-OCC/ds",
        destination: "/assets/datasheets/BTX-DUV-OCC_DS_AHD0647B.pdf",
        permanent: true,
      },
      {
        source: "/p/BTX-DUV-OCC/ds/",
        destination: "/assets/datasheets/BTX-DUV-OCC_DS_AHD0647B.pdf",
        permanent: true,
      },
      {
        source: "/p/BTX-DUV-10VFX/ds",
        destination: "/assets/datasheets/BTX-DUV-10VFX_DS_AHD0652B.pdf",
        permanent: true,
      },
      {
        source: "/p/BTX-DUV-10VFX/ds/",
        destination: "/assets/datasheets/BTX-DUV-10VFX_DS_AHD0652B.pdf",
        permanent: true,
      },
      {
        source: "/p/BTX-S5BWH/ds",
        destination: "/assets/datasheets/BTX-S5BWH_ds_AHD0654B.pdf",
        permanent: true,
      },
      {
        source: "/p/BTX-S5BWH/ds/",
        destination: "/assets/datasheets/BTX-S5BWH_ds_AHD0654B.pdf",
        permanent: true,
      },
      {
        source: "/p/NWO-OFX/ds",
        destination: "/assets/datasheets/NWO-OFX_HB-OCC-Sensor_DS_AHD0653B.pdf",
        permanent: true,
      },
      {
        source: "/p/NWO-OFX/ds/",
        destination: "/assets/datasheets/NWO-OFX_HB-OCC-Sensor_DS_AHD0653B.pdf",
        permanent: true,
      },
      {
        source: "/p/BTT-S1Axx/ds",
        destination: "/assets/datasheets/BTT-S1Axx_ds_AHD0618B.pdf",
        permanent: true,
      },
      {
        source: "/p/BTT-S1Axx/ds/",
        destination: "/assets/datasheets/BTT-S1Axx_ds_AHD0618B.pdf",
        permanent: true,
      },
      {
        source: "/p/BTT-S2Axx/ds",
        destination: "/assets/datasheets/BTT-S2Axx_ds_AHD0700A.pdf",
        permanent: true,
      },
      {
        source: "/p/BTT-S2Axx/ds/",
        destination: "/assets/datasheets/BTT-S2Axx_ds_AHD0700A.pdf",
        permanent: true,
      },
      {
        source: "/p/ZBT-S1Axx/ds",
        destination: "/assets/datasheets/ZBT-S1Axx_ds_AHD0701A.pdf",
        permanent: true,
      },
      {
        source: "/p/ZBT-S1Axx/ds/",
        destination: "/assets/datasheets/ZBT-S1Axx_ds_AHD0701A.pdf",
        permanent: true,
      },
      {
        source: "/p/ZBT-S2Axx/ds",
        destination: "/assets/datasheets/ZBT-S2Axx_ds_AHD0702A.pdf",
        permanent: true,
      },
      {
        source: "/p/ZBT-S2Axx/ds/",
        destination: "/assets/datasheets/ZBT-S2Axx_ds_AHD0702A.pdf",
        permanent: true,
      },
      {
        source: "/p/BTT-S4Axx-C20/ds",
        destination: "/assets/datasheets/BTT-S4Bxx-C20_AHD0718A.pdf",
        permanent: true,
      },
      {
        source: "/p/BTT-S4Axx-C20/ds/",
        destination: "/assets/datasheets/BTT-S4Bxx-C20_AHD0718A.pdf",
        permanent: true,
      },

      // ============================================
      // INSTALL GUIDE SHORTLINKS (/p/PART/ig/)
      // ============================================
      {
        source: "/p/E9T-S2HXX/ig",
        destination: "/assets/guides/E9T-S2Hxx_IM_AHD0230F.pdf",
        permanent: true,
      },
      {
        source: "/p/E9T-S2HXX/ig/",
        destination: "/assets/guides/E9T-S2Hxx_IM_AHD0230F.pdf",
        permanent: true,
      },
      {
        source: "/p/E9T-OBP/ig",
        destination:
          "/assets/guides/P2103-E9T-OBP_UG-V1-digital_rev-20220307_AHD0699A.pdf",
        permanent: true,
      },
      {
        source: "/p/E9T-OBP/ig/",
        destination:
          "/assets/guides/P2103-E9T-OBP_UG-V1-digital_rev-20220307_AHD0699A.pdf",
        permanent: true,
      },

      // ============================================
      // OLD WORDPRESS PRODUCT URLS → NEW URLS
      // ============================================

      // Switches
      {
        source:
          "/products/wireless-light-switches/single-rocker-wireless-light-switch",
        destination: "/products/single-rocker-wireless-light-switch",
        permanent: true,
      },
      {
        source:
          "/products/wireless-light-switches/single-rocker-wireless-light-switch/",
        destination: "/products/single-rocker-wireless-light-switch",
        permanent: true,
      },
      {
        source:
          "/products/wireless-light-switches/dual-rocker-wireless-light-switch-illumra",
        destination: "/products/dual-rocker-wireless-light-switch",
        permanent: true,
      },
      {
        source:
          "/products/wireless-light-switches/dual-rocker-wireless-light-switch-illumra/",
        destination: "/products/dual-rocker-wireless-light-switch",
        permanent: true,
      },
      {
        source:
          "/products/wireless-light-switches/handheld-remote-wireless-light-switch",
        destination: "/products/handheld-remote-wireless-light-switch",
        permanent: true,
      },
      {
        source:
          "/products/wireless-light-switches/handheld-remote-wireless-light-switch/",
        destination: "/products/handheld-remote-wireless-light-switch",
        permanent: true,
      },
      {
        source: "/products/wireless-light-switches/wireless-key-card-reader",
        destination: "/products/wireless-key-card-switch",
        permanent: true,
      },
      {
        source: "/products/wireless-light-switches/wireless-key-card-reader/",
        destination: "/products/wireless-key-card-switch",
        permanent: true,
      },
      {
        source: "/products/wireless-light-switches/bluetooth-switch",
        destination: "/products/bluetooth-switch",
        permanent: true,
      },
      {
        source: "/products/wireless-light-switches/bluetooth-switch/",
        destination: "/products/bluetooth-switch",
        permanent: true,
      },
      {
        source: "/products/wireless-light-switches/zigbee-switch",
        destination: "/products/zigbee-switch",
        permanent: true,
      },
      {
        source: "/products/wireless-light-switches/zigbee-switch/",
        destination: "/products/zigbee-switch",
        permanent: true,
      },
      {
        source: "/products/wireless-light-switches/dual-rocker-zigbee-switch",
        destination: "/products/dual-rocker-zigbee-switch",
        permanent: true,
      },
      {
        source: "/products/wireless-light-switches/dual-rocker-zigbee-switch/",
        destination: "/products/dual-rocker-zigbee-switch",
        permanent: true,
      },
      {
        source: "/products/wireless-light-switches/european-single-rocker",
        destination: "/products/european-single-rocker-switch",
        permanent: true,
      },
      {
        source: "/products/wireless-light-switches/european-single-rocker/",
        destination: "/products/european-single-rocker-switch",
        permanent: true,
      },
      {
        source:
          "/products/wireless-light-switches/european-style-double-rocker-wireless-light-switch",
        destination: "/products/european-dual-rocker-switch",
        permanent: true,
      },
      {
        source:
          "/products/wireless-light-switches/european-style-double-rocker-wireless-light-switch/",
        destination: "/products/european-dual-rocker-switch",
        permanent: true,
      },
      {
        source: "/products/wireless-light-switches/2-gang-switch",
        destination: "/products/2-gang-switch",
        permanent: true,
      },
      {
        source: "/products/wireless-light-switches/2-gang-switch/",
        destination: "/products/2-gang-switch",
        permanent: true,
      },

      // Wildcard for any remaining switch URLs
      {
        source: "/products/wireless-light-switches/:slug",
        destination: "/products/:slug",
        permanent: true,
      },
      {
        source: "/products/wireless-light-switches",
        destination: "/products?category=Wireless Light Switch",
        permanent: true,
      },
      {
        source: "/products/wireless-light-switches/",
        destination: "/products?category=Wireless Light Switch",
        permanent: true,
      },

      // Controllers/Receivers
      {
        source: "/products/receivers/100-277vac-relay",
        destination: "/products/100-277vac-relay",
        permanent: true,
      },
      {
        source: "/products/receivers/100-277vac-relay/",
        destination: "/products/100-277vac-relay",
        permanent: true,
      },
      {
        source: "/products/receivers/3-wire-relay-receiver-2",
        destination: "/products/3-wire-relay-receiver",
        permanent: true,
      },
      {
        source: "/products/receivers/3-wire-relay-receiver-2/",
        destination: "/products/3-wire-relay-receiver",
        permanent: true,
      },
      {
        source: "/products/receivers/0-10v-5a-area-fixture-controller",
        destination: "/products/0-10v-5a-area-fixture-controller",
        permanent: true,
      },
      {
        source: "/products/receivers/0-10v-5a-area-fixture-controller/",
        destination: "/products/0-10v-5a-area-fixture-controller",
        permanent: true,
      },
      {
        source:
          "/products/receivers/wireless-0-10v-dimming-20a-area-controller",
        destination: "/products/20a-0-10v-dimming-area-controller",
        permanent: true,
      },
      {
        source:
          "/products/receivers/wireless-0-10v-dimming-20a-area-controller/",
        destination: "/products/20a-0-10v-dimming-area-controller",
        permanent: true,
      },
      {
        source: "/products/receivers/600-watt-phase-cut-dimming-controller",
        destination: "/products/600-watt-phase-cut-dimming-controller",
        permanent: true,
      },
      {
        source: "/products/receivers/600-watt-phase-cut-dimming-controller/",
        destination: "/products/600-watt-phase-cut-dimming-controller",
        permanent: true,
      },
      {
        source: "/products/receivers/constant-voltage-led-dimmer",
        destination: "/products/constant-voltage-led-dimmer",
        permanent: true,
      },
      {
        source: "/products/receivers/constant-voltage-led-dimmer/",
        destination: "/products/constant-voltage-led-dimmer",
        permanent: true,
      },
      {
        source: "/products/receivers/hvac-setback-module",
        destination: "/products/hvac-setback-module",
        permanent: true,
      },
      {
        source: "/products/receivers/hvac-setback-module/",
        destination: "/products/hvac-setback-module",
        permanent: true,
      },
      {
        source: "/products/receivers/cuv-control-transmitter",
        destination: "/products/cuv-control-transmitter",
        permanent: true,
      },
      {
        source: "/products/receivers/cuv-control-transmitter/",
        destination: "/products/cuv-control-transmitter",
        permanent: true,
      },
      {
        source: "/products/receivers/nwo-duv-occ",
        destination: "/products/nwo-duv-occ",
        permanent: true,
      },
      {
        source: "/products/receivers/nwo-duv-occ/",
        destination: "/products/nwo-duv-occ",
        permanent: true,
      },
      {
        source: "/8-channel-low-voltage-controller",
        destination: "/products/8-channel-low-voltage-controller",
        permanent: true,
      },
      {
        source: "/8-channel-low-voltage-controller/",
        destination: "/products/8-channel-low-voltage-controller",
        permanent: true,
      },

      // Wildcard for remaining receiver URLs
      {
        source: "/products/receivers/:slug",
        destination: "/products/:slug",
        permanent: true,
      },
      {
        source: "/products/receivers",
        destination: "/products?category=Controllers",
        permanent: true,
      },
      {
        source: "/products/receivers/",
        destination: "/products?category=Controllers",
        permanent: true,
      },

      // Bluetooth Controls
      {
        source: "/products/bluetooth-controls/bluetooth-mesh-power-pack",
        destination: "/products/bluetooth-mesh-power-pack",
        permanent: true,
      },
      {
        source: "/products/bluetooth-controls/bluetooth-mesh-power-pack/",
        destination: "/products/bluetooth-mesh-power-pack",
        permanent: true,
      },
      {
        source: "/products/bluetooth-controls/bluetooth-pir-occupancy-sensor",
        destination: "/products/bluetooth-pir-occupancy-sensor",
        permanent: true,
      },
      {
        source: "/products/bluetooth-controls/bluetooth-pir-occupancy-sensor/",
        destination: "/products/bluetooth-pir-occupancy-sensor",
        permanent: true,
      },
      {
        source: "/products/bluetooth-controls/:slug",
        destination: "/products/:slug",
        permanent: true,
      },
      {
        source: "/products/bluetooth-controls",
        destination: "/products?category=Bluetooth Fixture Controllers",
        permanent: true,
      },
      {
        source: "/products/bluetooth-controls/",
        destination: "/products?category=Bluetooth Fixture Controllers",
        permanent: true,
      },

      // Sensors
      {
        source:
          "/products/wireless-sensors-2/high-bay-ceiling-occupancy-sensor",
        destination: "/products/high-bay-ceiling-occupancy-sensor",
        permanent: true,
      },
      {
        source:
          "/products/wireless-sensors-2/high-bay-ceiling-occupancy-sensor/",
        destination: "/products/high-bay-ceiling-occupancy-sensor",
        permanent: true,
      },
      {
        source: "/products/wireless-sensors-2/ceiling-occupancy-sensor",
        destination: "/products/ceiling-occupancy-sensor",
        permanent: true,
      },
      {
        source: "/products/wireless-sensors-2/ceiling-occupancy-sensor/",
        destination: "/products/ceiling-occupancy-sensor",
        permanent: true,
      },
      {
        source: "/products/wireless-sensors-2/wall-occupancy-sensor",
        destination: "/products/wall-occupancy-sensor",
        permanent: true,
      },
      {
        source: "/products/wireless-sensors-2/wall-occupancy-sensor/",
        destination: "/products/wall-occupancy-sensor",
        permanent: true,
      },
      {
        source: "/products/wireless-sensors-2/wireless-door-window-sensor",
        destination: "/products/wireless-window-door-sensor",
        permanent: true,
      },
      {
        source: "/products/wireless-sensors-2/wireless-door-window-sensor/",
        destination: "/products/wireless-window-door-sensor",
        permanent: true,
      },
      {
        source: "/products/wireless-sensors-2/:slug",
        destination: "/products/:slug",
        permanent: true,
      },
      {
        source: "/products/wireless-sensors-2",
        destination: "/products?category=Wireless Sensors",
        permanent: true,
      },
      {
        source: "/products/wireless-sensors-2/",
        destination: "/products?category=Wireless Sensors",
        permanent: true,
      },

      // Kits
      {
        source:
          "/products/wireless-solution-kits/basic-wireless-light-switch-kit",
        destination: "/products/basic-wireless-switch-kit",
        permanent: true,
      },
      {
        source:
          "/products/wireless-solution-kits/basic-wireless-light-switch-kit/",
        destination: "/products/basic-wireless-switch-kit",
        permanent: true,
      },
      {
        source: "/products/wireless-solution-kits/:slug",
        destination: "/products/:slug",
        permanent: true,
      },
      {
        source: "/products/wireless-solution-kits",
        destination: "/products?category=Wireless Light Switch Kits",
        permanent: true,
      },
      {
        source: "/products/wireless-solution-kits/",
        destination: "/products?category=Wireless Light Switch Kits",
        permanent: true,
      },

      // Accessories
      {
        source: "/products/accessories/mobile-commissioning-system",
        destination: "/products/mobile-commissioning-system",
        permanent: true,
      },
      {
        source: "/products/accessories/mobile-commissioning-system/",
        destination: "/products/mobile-commissioning-system",
        permanent: true,
      },
      {
        source: "/products/accessories/bacnet-room-controller-gateway",
        destination: "/products/bacnet-gateway",
        permanent: true,
      },
      {
        source: "/products/accessories/bacnet-room-controller-gateway/",
        destination: "/products/bacnet-gateway",
        permanent: true,
      },

      // ============================================
      // MAIN PAGE REDIRECTS
      // ============================================
      {
        source: "/contact-us",
        destination: "/contact",
        permanent: true,
      },
      {
        source: "/contact-us/",
        destination: "/contact",
        permanent: true,
      },
      {
        source: "/faq/",
        destination: "/faq",
        permanent: true,
      },
      {
        source: "/about/",
        destination: "/about",
        permanent: true,
      },
      {
        source: "/about-illumra",
        destination: "/about",
        permanent: true,
      },
      {
        source: "/about-illumra/",
        destination: "/about",
        permanent: true,
      },
      {
        source: "/about/services",
        destination: "/about",
        permanent: true,
      },
      {
        source: "/about/services/",
        destination: "/about",
        permanent: true,
      },
      {
        source: "/products/",
        destination: "/products",
        permanent: true,
      },

      // Distribution
      {
        source: "/distribution",
        destination: "/distributors",
        permanent: true,
      },
      {
        source: "/distribution/",
        destination: "/distributors",
        permanent: true,
      },
      {
        source: "/distribution/become-distributor",
        destination: "/about#become-a-distributor",
        permanent: true,
      },
      {
        source: "/distribution/become-distributor/",
        destination: "/about#become-a-distributor",
        permanent: true,
      },
      {
        source: "/distribution/become-a-rep",
        destination: "/about#rep",
        permanent: true,
      },
      {
        source: "/distribution/become-a-rep/",
        destination: "/about#rep",
        permanent: true,
      },
      {
        source: "/become-a-distributor",
        destination: "/about#become-a-distributor",
        permanent: true,
      },
      {
        source: "/become-a-distributor/",
        destination: "/about#become-a-distributor",
        permanent: true,
      },
      {
        source: "/become-a-rep",
        destination: "/about#rep",
        permanent: true,
      },
      {
        source: "/become-a-rep/",
        destination: "/about#rep",
        permanent: true,
      },

      // Partners
      {
        source: "/partners",
        destination: "/about",
        permanent: true,
      },
      {
        source: "/partners/",
        destination: "/about",
        permanent: true,
      },
      {
        source: "/masterconnect",
        destination: "/products?category=Wireless Light Switch",
        permanent: true,
      },
      {
        source: "/masterconnect/",
        destination: "/products?category=Wireless Light Switch",
        permanent: true,
      },
      {
        source: "/easysense",
        destination: "/products?category=Wireless Light Switch",
        permanent: true,
      },
      {
        source: "/easysense/",
        destination: "/products?category=Wireless Light Switch",
        permanent: true,
      },
      {
        source: "/silvair",
        destination: "/products/bluetooth-switch",
        permanent: true,
      },
      {
        source: "/silvair/",
        destination: "/products/bluetooth-switch",
        permanent: true,
      },
      {
        source: "/enlighted",
        destination: "/products/bluetooth-switch",
        permanent: true,
      },
      {
        source: "/enlighted/",
        destination: "/products/bluetooth-switch",
        permanent: true,
      },

      // Application/Resources pages
      {
        source: "/application/case-studies",
        destination: "/case-studies",
        permanent: true,
      },
      {
        source: "/application/case-studies/",
        destination: "/case-studies",
        permanent: true,
      },
      {
        source: "/application/case-studies/:slug",
        destination: "/case-studies",
        permanent: true,
      },
      {
        source: "/wireless-led-control",
        destination: "/about",
        permanent: true,
      },
      {
        source: "/wireless-led-control/",
        destination: "/about",
        permanent: true,
      },
      {
        source: "/self-powered-switch-technology",
        destination: "/about",
        permanent: true,
      },
      {
        source: "/self-powered-switch-technology/",
        destination: "/about",
        permanent: true,
      },
      {
        source: "/application/application-notes/green-solutions",
        destination: "/about",
        permanent: true,
      },
      {
        source: "/application/application-notes/green-solutions/",
        destination: "/about",
        permanent: true,
      },
      {
        source: "/Training",
        destination: "/faq",
        permanent: true,
      },
      {
        source: "/Training/",
        destination: "/faq",
        permanent: true,
      },
      {
        source: "/training",
        destination: "/faq",
        permanent: true,
      },
      {
        source: "/training/",
        destination: "/faq",
        permanent: true,
      },
      {
        source: "/private-labeling",
        destination: "/about",
        permanent: true,
      },
      {
        source: "/private-labeling/",
        destination: "/about",
        permanent: true,
      },
      {
        source: "/policies",
        destination: "/about",
        permanent: true,
      },
      {
        source: "/policies/",
        destination: "/about",
        permanent: true,
      },
      {
        source: "/press",
        destination: "/posts",
        permanent: true,
      },
      {
        source: "/press/",
        destination: "/posts",
        permanent: true,
      },

      // News/Blog
      {
        source: "/category/illumra-news",
        destination: "/posts",
        permanent: true,
      },
      {
        source: "/category/illumra-news/",
        destination: "/posts",
        permanent: true,
      },
      {
        source: "/category/tutorials",
        destination: "/posts",
        permanent: true,
      },
      {
        source: "/category/tutorials/",
        destination: "/posts",
        permanent: true,
      },
      {
        source: "/press/news",
        destination: "/posts",
        permanent: true,
      },
      {
        source: "/press/news/",
        destination: "/posts",
        permanent: true,
      },
      {
        source: "/press/news/page/:page",
        destination: "/posts",
        permanent: true,
      },

      // Support
      {
        source: "/support",
        destination: "https://illumra.freshdesk.com/support/home",
        permanent: true,
      },
      {
        source: "/support/",
        destination: "https://illumra.freshdesk.com/support/home",
        permanent: true,
      },

      // ============================================
      // CATCH-ALL FOR OLD WP-CONTENT ASSETS
      // Only use if keeping PDFs at same relative paths
      // ============================================
      // {
      //   source: '/wp-content/uploads/:path*',
      //   destination: '/assets/uploads/:path*',
      //   permanent: true,
      // },
    ];
  },
};

export default nextConfig;
