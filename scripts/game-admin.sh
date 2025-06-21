#!/bin/bash

# RACE游戏管理脚本
# 用于调用服务器的管理员接口来控制游戏

# 配置参数
SERVER_HOST=${SERVER_HOST:-"localhost"}
SERVER_PORT=${SERVER_PORT:-"8000"}
MODERATION_SECRET=${MODERATION_SECRET:-"moderation-secret"}
SERVER_URL="http://${SERVER_HOST}:${SERVER_PORT}"

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 打印带颜色的消息
print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️ $1${NC}"
}

# 检查curl是否可用
check_curl() {
    if ! command -v curl &> /dev/null; then
        print_error "curl命令未找到，请先安装curl"
        exit 1
    fi
}

# 调用API的通用函数
call_api() {
    local endpoint=$1
    local method=${2:-"GET"}
    local show_response=${3:-true}
    
    print_info "调用接口: ${method} ${SERVER_URL}${endpoint}"
    
    if [ "$method" = "POST" ]; then
        response=$(curl -s -w "\n%{http_code}" -X POST \
            -H "Content-Type: application/json" \
            -H "Authorization: Bearer ${MODERATION_SECRET}" \
            "${SERVER_URL}${endpoint}")
    else
        response=$(curl -s -w "\n%{http_code}" "${SERVER_URL}${endpoint}")
    fi
    
    # 分离响应体和状态码
    http_code=$(echo "$response" | tail -n1)
    response_body=$(echo "$response" | head -n -1)
    
    # 检查HTTP状态码
    case $http_code in
        200)
            # 对于200状态码，还需要检查JSON中的success字段
            if echo "$response_body" | grep -q '"success".*false'; then
                # 检查是否是认证错误
                if echo "$response_body" | grep -q -i "unauthorized"; then
                    print_error "认证失败 - 请检查MODERATION_SECRET环境变量"
                    echo "$response_body" | python3 -m json.tool 2>/dev/null || echo "$response_body"
                    return 1
                else
                    print_error "操作失败"
                    echo "$response_body" | python3 -m json.tool 2>/dev/null || echo "$response_body"
                    return 1
                fi
            else
                print_success "请求成功 (HTTP $http_code)"
                if [ "$show_response" = true ] && [ -n "$response_body" ]; then
                    echo "$response_body" | python3 -m json.tool 2>/dev/null || echo "$response_body"
                fi
                return 0
            fi
            ;;
        401)
            print_error "认证失败 (HTTP $http_code) - 请检查MODERATION_SECRET"
            echo "$response_body"
            return 1
            ;;
        400)
            print_error "请求错误 (HTTP $http_code)"
            echo "$response_body"
            return 1
            ;;
        404)
            print_error "接口不存在 (HTTP $http_code) - 请确认服务器在RACE模式下运行"
            return 1
            ;;
        500)
            print_error "服务器内部错误 (HTTP $http_code)"
            echo "$response_body"
            return 1
            ;;
        000)
            print_error "无法连接到服务器 - 请检查服务器是否运行在 ${SERVER_URL}"
            return 1
            ;;
        *)
            print_error "未知错误 (HTTP $http_code)"
            echo "$response_body"
            return 1
            ;;
    esac
}

# 显示游戏状态
show_status() {
    print_info "获取游戏状态..."
    call_api "/serverinfo" "GET"
}

# 结束游戏
end_game() {
    print_warning "准备结束当前游戏..."
    if call_api "/admin/endgame" "POST"; then
        print_success "游戏结束命令已发送"
    else
        print_error "结束游戏失败"
        return 1
    fi
}

# 重启游戏
restart_game() {
    print_warning "准备重启游戏..."
    if call_api "/admin/restart" "POST"; then
        print_success "游戏重启命令已发送"
    else
        print_error "重启游戏失败"
        return 1
    fi
}

# 显示帮助信息
show_help() {
    echo "RACE游戏管理脚本"
    echo ""
    echo "用法: $0 [命令] [选项]"
    echo ""
    echo "命令:"
    echo "  status      显示游戏状态"
    echo "  end         结束当前游戏"
    echo "  restart     重启游戏"
    echo "  config      显示当前配置"
    echo "  help        显示此帮助信息"
    echo ""
    echo "环境变量:"
    echo "  SERVER_HOST         服务器地址 (默认: localhost)"
    echo "  SERVER_PORT         服务器端口 (默认: 8000)"
    echo "  MODERATION_SECRET   管理员密钥 (默认: moderation-secret)"
    echo ""
    echo "示例:"
    echo "  $0 status"
    echo "  $0 end"
    echo "  $0 restart"
    echo "  $0 config"
    echo "  SERVER_HOST=192.168.1.100 $0 status"
    echo "  MODERATION_SECRET=my-secret $0 end"
}

# 显示当前配置
show_config() {
    print_info "当前配置:"
    echo "  服务器地址: ${SERVER_HOST}"
    echo "  服务器端口: ${SERVER_PORT}"
    echo "  完整URL: ${SERVER_URL}"
    echo "  管理员密钥: ${MODERATION_SECRET}"
    echo ""
    print_warning "如果认证失败，请检查服务器的MODERATION_SECRET环境变量是否与上面的值匹配"
}

# 主函数
main() {
    check_curl
    
    case "${1:-help}" in
        "status"|"s")
            show_status
            ;;
        "end"|"e")
            end_game
            ;;
        "restart"|"r")
            restart_game
            ;;
        "config"|"c")
            show_config
            ;;
        "help"|"h"|"--help"|"-h")
            show_help
            ;;
        *)
            print_error "未知命令: $1"
            echo ""
            show_help
            exit 1
            ;;
    esac
}

# 脚本入口
main "$@" 