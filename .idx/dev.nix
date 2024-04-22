{pkgs}: {
  channel = "stable-23.11";
  packages = [
    pkgs.nodejs_20
  ];
  idx.extensions = [
    
  
 "bradlc.vscode-tailwindcss"
 "github.vscode-github-actions"];
  idx.previews = {
    previews = [
      {
        command = [
          "npm"
          "run"
          "dev"
          "--"
          "--port"
          "$PORT"
          "--hostname"
          "0.0.0.0"
        ];
        id = "web";
        manager = "web";
      }
    ];
  };
}